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
import { Router } from '@angular/router';
import { TitleScreenComponent } from '../../../../shared/components/title-screen/title-screen.component';
import { ExamTable } from '../../model/teacher';
import { TeacherService } from '../../services/exams.service';
import { AuthService } from '../../../../authentication/services/auth.service';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [TableModule, CommonModule, TitleScreenComponent],
  templateUrl: './exams.component.html',
  styleUrl: './exams.component.scss',
})
export class ExamsComponent implements OnInit {
  teacherService = inject(TeacherService);
  authService = inject(AuthService);
  cdr = inject(ChangeDetectorRef);
  toastr = inject(ToastrService);
  router = inject(Router);
  examId: number = 0;
  ageSummary: number = 0;
  currentUser: any;
  isLoading: boolean = false;

  // table
  @ViewChild('table') table: APIDefinition | any;
  // edit
  @ViewChild('actionTpl', { static: true }) actionTpl?: TemplateRef<any>;
  configuration: Config | any;
  columns: Columns[] = [];
  data: ExamTable[] = [];
  dataCopy: ExamTable[] = [];

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
      { key: 'examName', title: 'أسم الأمتحان' },
      { key: 'tutorialName', title: 'اسم الدورة' },
      { key: 'questionsNumber', title: 'عدد الأسئلة' },

      { key: 'examId', title: ' تعديل أو حذف ', cellTemplate: this.actionTpl },
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
      .map((_) => _.examId)
      .reduce((acc, cur) => cur + acc, 0);

    this.currentUser = this.authService.currentUser().userDto;
    this.fetchAllExams({ teacherId: this.currentUser.id });
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
      .map((_) => _.examId)
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
  edit(examId: number): void {
    this.router.navigate(['/instructor/exams/', examId]);
  }

  // Remove fun.
  remove(examId: number): void {
    this.isLoading = true;
    this.teacherService.deleteExam({ examId: examId }).subscribe({
      next: ({ statusCode, msg }) => {
        if (statusCode === 200) {
          this.fetchAllExams({ teacherId: this.currentUser.id });
          this.isLoading = false;
          this.toastr.success(msg);
        } else {
          this.isLoading = false;
          this.toastr.error(msg);
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  // goTo Add User
  goToAddExam(): void {
    this.router.navigate(['/instructor/exams/', 0]);
  }

  fetchAllExams(teacherId: any): void {
    this.configuration.isLoading = true;
    this.teacherService
      .getAllExamsPerTeacherTutorials(teacherId)
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
}
