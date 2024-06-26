import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  inject,
  ChangeDetectorRef,
} from '@angular/core';

import {
  API,
  APIDefinition,
  Columns,
  Config,
  DefaultConfig,
  TableModule,
} from 'ngx-easy-table';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ID_Name } from '../../model/admin-model';
import { TutorialService } from '../../services/tutorial.service';

import { ApiCacheService } from '../../../../shared/services/api-cache.service';
import { Router } from '@angular/router';
import { TitleScreenComponent } from '../../../../shared/components/title-screen/title-screen.component';
import { ExportService } from '../../../../shared/services/export.service';

@Component({
  selector: 'app-tutorials-admin',
  standalone: true,
  imports: [TableModule, CommonModule, TitleScreenComponent],
  templateUrl: './tutorials-admin.component.html',
  styleUrl: './tutorials-admin.component.scss',
})
export class TutorialsAdminComponent implements OnInit {
  tutorialService = inject(TutorialService);
  apiCacheService = inject(ApiCacheService);
  exportService = inject(ExportService);
  toastr = inject(ToastrService);
  cdr = inject(ChangeDetectorRef);
  router = inject(Router);
  tutorialId: number = 0;
  ageSummary: number = 0;

  // table
  @ViewChild('table') table: APIDefinition | any;
  // edit
  @ViewChild('actionTpl', { static: true }) actionTpl?: TemplateRef<any>;
  @ViewChild('actionToggle', { static: true }) actionToggle?: TemplateRef<any>;
  @ViewChild('editPrice', { static: true }) editPrice?: TemplateRef<any>;

  configuration: Config | any;
  columns: Columns[] = [];
  data: ID_Name[] = [];
  dataCopy: ID_Name[] = [];

  /// loading
  public pagination = {
    limit: 10,
    offset: 0,
    count: -1,
  };
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor() {}

  ngOnInit(): void {
    this.columns = [
      { key: 'name', title: 'أسم الدورة' },
      { key: 'teacherName', title: 'أسم المدرس' },
      { key: 'categoryName', title: 'أسم التصنيف' },
      { key: 'price', title: ' سعر الدورة', cellTemplate: this.editPrice },
      {
        key: 'isEnabled',
        title: 'إظهار بالموقع',
        cellTemplate: this.actionToggle,
      },

      { key: 'id', title: 'تعديل ', cellTemplate: this.actionTpl },
    ];

    this.configuration = { ...DefaultConfig };

    // max size for pagination === 7
    this.configuration.paginationMaxSize = 7;
    // this.configuration.fixedColumnWidth = false;
    this.configuration.rows = 7;
    this.configuration.tableLayout = {
      striped: true,
      hover: true,
      theme: 'light',
    };

    this.configuration.horizontalScroll = true;
    this.ageSummary = this.data
      .map((_) => _.id)
      .reduce((acc, cur) => cur + acc, 0);

    this.fetchAllTutorials();
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

  // edit fun
  edit(tutorialId: number): void {
    this.router.navigate(['/admin/tutorial/', tutorialId]);
  }

  // goTo Add User
  goToAddTutorial(): void {
    this.router.navigate(['/admin/tutorial/', 0]);
  }

  fetchAllTutorials(): void {
    this.configuration.isLoading = true;
    this.tutorialService
      .getTutorials()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: ({ result, statusCode, msg }) => {
          if (statusCode === 200) {
            this.data = result;
            this.dataCopy = result;
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

  exportTable(): void {
    const ignoreCols = ['isEnabled', 'تعديل']; // Specify columns to ignore

    this.exportService.exportTableToExcel(
      this.data,
      'All Tutorials',
      ignoreCols
    );
  }
}
