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
import { TeacherService } from '../../services/teacher.service';
import { TitleScreenComponent } from '../../../../shared/components/title-screen/title-screen.component';
import { AuthService } from '../../../../authentication/services/auth.service';
import { AttachmentsService } from '../../services/attachments.service';
import { AddAttachmentsComponent } from './add-attachments/add-attachments.component';
@Component({
  selector: 'app-all-attachments',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    TitleScreenComponent,
    AddAttachmentsComponent,
  ],
  templateUrl: './all-attachments.component.html',
  styleUrl: './all-attachments.component.scss',
})
export class AllAttachmentsComponent implements OnInit {
  toastr = inject(ToastrService);
  attachmentsService = inject(AttachmentsService);
  authService = inject(AuthService);
  currentUser: any;
  cdr = inject(ChangeDetectorRef);
  isDelete: boolean = false;
  ageSummary: number = 0;

  // table
  @ViewChild('table') table: APIDefinition | any;
  // edit
  @ViewChild('actionTpl', { static: true }) actionTpl?: TemplateRef<any>;
  @ViewChild('date', { static: true }) date?: TemplateRef<any>;
  @ViewChild('isTutorial', { static: true }) isTutorial?: TemplateRef<any>;

  configuration: Config | any;
  columns: Columns[] = [];
  data: any[] = [];
  dataCopy: any[] = [];

  /// loading
  public pagination = {
    limit: 10,
    offset: 0,
    count: -1,
  };
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.columns = [
      { key: 'name', title: 'أسم الملف' },
      // { key: 'uploadedAt', title: 'تاريخ الرفع', cellTemplate: this.date },
      { key: 'link', title: 'الرابط' },
      {
        key: 'isTutorial',
        title: 'دورة أو درس',
        cellTemplate: this.isTutorial,
      },
      { key: 'id', title: ' حذف', cellTemplate: this.actionTpl },
    ];

    this.configuration = { ...DefaultConfig };
    this.configuration.paginationMaxSize = 7;
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

    this.currentUser = this.authService.currentUser().userDto;

    this.fetchAllAttachments({ userId: this.currentUser.id });
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

  // Remove fun.
  remove(pdfId: number): void {
    this.isDelete = true;
    this.attachmentsService
      .deletePdf({
        pdfId,
      })
      .subscribe({
        next: ({ statusCode, msg }) => {
          if (statusCode === 200) {
            this.fetchAllAttachments({ userId: this.currentUser.id });
            this.isDelete = false;
            this.toastr.success(msg);
          } else {
            this.toastr.error(msg);
            this.isDelete = false;
          }
        },
        error: (err) => {
          console.log(err);
          this.isDelete = false;
        },
      });
  }

  fetchAllAttachments(userId: any): void {
    this.configuration.isLoading = true;
    this.attachmentsService
      .getAllAttachments(userId)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: ({ result, isSuccess, statusCode, msg }) => {
          if (statusCode === 200) {
            this.data = this.dataCopy = result;
            this.pagination.count =
              this.pagination.count === -1
                ? result
                  ? result.length
                  : 0
                : this.pagination.count;
            this.pagination = { ...this.pagination };
            this.configuration.isLoading = !isSuccess;
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
