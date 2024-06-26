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

import { PaymentInfo } from '../../model/admin-model';
import { NgClass } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TitleScreenComponent } from '../../../../shared/components/title-screen/title-screen.component';
import { AdminService } from '../../services/admin.service';

type StudentInfo = {
  id: number;
  studentName: string;
  tutorialName: string;
  categoryName: string;
  startDate: string;
  endDate: string;
};

@Component({
  selector: 'app-student-admin',
  standalone: true,
  imports: [TableModule, NgClass, TitleScreenComponent, ReactiveFormsModule],
  templateUrl: './student-admin.component.html',
  styleUrl: './student-admin.component.scss',
})
export class StudentAdminComponent implements OnInit {
  adminService = inject(AdminService);
  toastr = inject(ToastrService);
  fb = inject(FormBuilder);
  cdr = inject(ChangeDetectorRef);
  isLoading: boolean = false;
  modal: boolean = false;
  formData!: FormGroup;
  submitted = false;
  startDate: string = '';
  endDate?: string | null;
  maxDate: string = '';

  // for table
  @ViewChild('levelHeaderActionTemplate', { static: true })
  levelHeaderActionTemplate?: TemplateRef<any>;
  @ViewChild('table') table: APIDefinition | any;
  // edit
  @ViewChild('actionTpl', { static: true }) actionTpl?: TemplateRef<any>;

  configuration: Config | any;
  columns: Columns[] = [];
  data: StudentInfo[] = [];
  dataCopy: StudentInfo[] = [];
  ageSummary: number = 0;
  /// loading
  public pagination = {
    limit: 10,
    offset: 0,
    count: -1,
  };
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    // To Get Date Now
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because getMonth() returns 0-indexed month
    const day = currentDate.getDate().toString().padStart(2, '0');

    this.endDate = `${year}-${month}-${day}`;

    this.formData = this.fb.group({
      startDate: new FormControl(''),
      endDate: new FormControl(this.endDate),
    });

    this.columns = [
      { key: 'studentName', title: 'أسم الطالب' },
      { key: 'tutorialName', title: 'أسم الدورة' },
      { key: 'categoryName', title: 'اسم التصنيف' },
      { key: 'startDate', title: 'تاريخ الشراء' },
      { key: 'endDate', title: 'تاريخ النهاية' },
    ];
    this.configuration = { ...DefaultConfig };

    // max size for pagination === 7
    this.configuration.paginationMaxSize = 7;
    // this.configuration.fixedColumnWidth = false;
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

    if (this.formData.value.startDate == '') {
      delete this.formData.value.startDate;
    }

    this.fetchAllStudents(this.formData.value);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // onEvent($event: { event: string; value: { key: string; value: string }[] }) {
  //   if ($event.event !== 'onSearch') {
  //     return;
  //   }
  //   const filterKey = $event.value[0].key;
  //   const filterVal = $event.value[0].value;
  //   this.ageSummary = this.data
  //     .filter((item: any) => `${item[filterKey]}`.includes(filterVal))
  //     .map((_) => _.id)
  //     .reduce((acc, cur) => cur + acc, 0);
  // }
  // Search
  onChange(event: Event): void {
    this.table.apiEvent({
      type: API.onGlobalSearch,
      value: (event.target as HTMLInputElement).value,
    });
  }

  showModal(): void {
    this.formData.reset();
    this.modal = true;
  }

  hideModal(): void {
    this.modal = false;
  }

  onSubmit() {
    this.submitted = true;
    if (this.formData.invalid) {
      return;
    }
    if (this.formData.value.startDate > this.formData.value.endDate) {
      this.toastr.error('تأكد من صلاحية التاريخ');
      return;
    }
    this.isLoading = true;
    if (this.formData.value.endDate == null) {
      this.formData.controls['endDate'].setValue(this.endDate);
    }
    if (this.formData.value.startDate == null) {
      delete this.formData.value.startDate;
    }

    this.fetchAllStudents(this.formData.value);
  }

  // fetchPayment
  fetchAllStudents(date: any): void {
    this.configuration.isLoading = true;
    this.adminService
      .getStudentTutorials(date)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: ({ statusCode, msg, result }) => {
          if (statusCode === 200) {
            this.data = this.dataCopy = result;
            this.modal = false;
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
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }

  clearDate(): void {
    if (this.formData.value.startDate) {
      delete this.formData.value.startDate;
      this.fetchAllStudents(this.formData.value);
    } else {
      this.toastr.error('لا يوجد تاريخ محدد');
    }
  }
}
