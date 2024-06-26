import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  inject,
  ChangeDetectorRef,
  signal,
} from '@angular/core';

import {
  API,
  APIDefinition,
  Columns,
  Config,
  DefaultConfig,
  TableModule,
} from 'ngx-easy-table';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { SystemUser } from '../../model/admin-model';
import { Subject, takeUntil } from 'rxjs';
import { NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ApiCacheService } from '../../../../shared/services/api-cache.service';
import { TitleScreenComponent } from '../../../../shared/components/title-screen/title-screen.component';

@Component({
  selector: 'app-users-admin',
  standalone: true,
  imports: [TableModule, NgClass, TitleScreenComponent],
  templateUrl: './users-admin.component.html',
  styleUrl: './users-admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersAdminComponent implements OnInit {
  apiCacheService = inject(ApiCacheService);
  adminService = inject(AdminService);
  router = inject(Router);
  toastr = inject(ToastrService);
  isLoading = signal<boolean>(false);

  // for table
  @ViewChild('levelHeaderActionTemplate', { static: true })
  levelHeaderActionTemplate?: TemplateRef<any>;
  @ViewChild('table') table: APIDefinition | any;
  // edit
  @ViewChild('actionTpl', { static: true }) actionTpl?: TemplateRef<any>;

  configuration: Config | any;
  columns: Columns[] = [];
  data: SystemUser[] = [];
  dataCopy: SystemUser[] = [];
  ageSummary: number = 0;
  // checkbox
  selectedLevels = new Set<string>([
    'مدرس',
    'ولي أمر',
    'مدخل بيانات',
    'أدمن',
    'مشرف مدرسة',
  ]);
  selectedRole = '';

  /// loading
  public pagination = {
    limit: 10,
    offset: 0,
    count: -1,
  };
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private readonly cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.columns = [
      { key: 'name', title: 'الاسم' },
      { key: 'email', title: 'الايميل' },
      { key: 'mobileNumber', title: 'الجوال' },
      {
        key: 'roleName',
        title: 'الدور',
        headerActionTemplate: this.levelHeaderActionTemplate,
      },
      { key: 'id', title: 'تعديل أو حذف', cellTemplate: this.actionTpl },
    ];

    this.configuration = { ...DefaultConfig };

    // max size for pagination === 7
    this.configuration.paginationMaxSize = 7;
    this.configuration.rows = 10;
    this.configuration.tableLayout = {
      striped: true,
      hover: true,
      theme: 'light',
    };
    this.configuration.horizontalScroll = true;
    this.ageSummary = this.data
      .map((_) => _.id)
      .reduce((acc, cur) => cur + acc, 0);

    this.fetchAllUsers();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onEvent($event: { event: string; value: { key: string; value: string }[] }) {
    if ($event.event !== 'onSearch') {
      return;
    }
    const filterKey = $event.value[0].key;
    const filterVal = $event.value[0].value;
    this.ageSummary = this.data
      .filter((item: any) => `${item[filterKey]}`.includes(filterVal))
      .map((_) => _.id)
      .reduce((acc, cur) => cur + acc, 0);
  }

  // Search
  onChange(event: Event): void {
    this.table.apiEvent({
      type: API.onGlobalSearch,
      value: (event.target as HTMLInputElement).value,
    });
  }

  // checkbox for toggle role
  filter(field: string, event: Event | string): void {
    const value =
      typeof event === 'string'
        ? event
        : (event.target as HTMLInputElement).value;
    if (field === 'roleName') {
      this.selectedLevels.has(value)
        ? this.selectedLevels.delete(value)
        : this.selectedLevels.add(value);
    }

    this.data = [...this.dataCopy].filter(({ roleName }) => {
      return (
        this.selectedLevels.has(roleName) &&
        roleName
          .toLocaleLowerCase()
          .includes(this.selectedRole.toLocaleLowerCase())
      );
    });
  }

  // edit fun
  edit(userId: number): void {
    this.router.navigate(['/admin/users/', userId]);
  }

  // Remove fun.
  remove(userId: number): void {
    this.isLoading.set(true);
    this.adminService
      .deleteSystemUser({
        userId: userId,
      })
      .subscribe({
        next: ({ statusCode, msg }) => {
          if (statusCode === 200) {
            this.apiCacheService.clearCache();
            this.fetchAllUsers();
            this.isLoading.update((v) => (v = false));
            this.toastr.success(msg);
          } else {
            this.isLoading.update((v) => (v = false));
            this.toastr.error(msg);
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoading.update((v) => (v = false));
        },
      });
  }

  // goTo Add User
  goToAddUser(): void {
    this.router.navigate(['/admin/users/', 0]);
  }

  // Get All Users
  private fetchAllUsers(): void {
    this.configuration.isLoading = true;
    this.adminService
      .getAllSystemUsers()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: ({ result, statusCode, msg }) => {
          if (statusCode === 200) {
            this.data = this.dataCopy = result;
            // ensure this.pagination.count is set only once and contains count of the whole array, not just paginated one
            this.pagination.count =
              this.pagination.count === -1
                ? result
                  ? result.length
                  : 0
                : this.pagination.count;
            this.pagination = { ...this.pagination };
            this.configuration.isLoading = false;
            this.cdr.detectChanges();
          } else {
            this.toastr.error(msg);
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
