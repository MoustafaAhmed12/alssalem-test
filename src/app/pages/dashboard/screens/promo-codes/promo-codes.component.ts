import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  inject,
  ChangeDetectorRef,
  CUSTOM_ELEMENTS_SCHEMA,
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

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ApiCacheService } from '../../../../shared/services/api-cache.service';
import { TitleScreenComponent } from '../../../../shared/components/title-screen/title-screen.component';
import { PromoService } from '../../services/promo.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ID_Name } from '../../model/admin-model';

@Component({
  selector: 'app-promo-codes',
  standalone: true,
  imports: [
    TableModule,
    NgSelectModule,
    ReactiveFormsModule,

    CommonModule,
    TitleScreenComponent,
  ],
  templateUrl: './promo-codes.component.html',
  styleUrl: './promo-codes.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PromoCodesComponent implements OnInit {
  toastr = inject(ToastrService);
  promoService = inject(PromoService);
  apiCacheService = inject(ApiCacheService);
  fb = inject(FormBuilder);
  cdr = inject(ChangeDetectorRef);

  promoCodeId: number = 0;
  isDelete: boolean = false;
  isLoading: boolean = false;
  submitted: boolean = false;
  modal: boolean = false;
  startDate: string = '';
  endDate?: string | null;
  maxDate: string = '';

  formData!: FormGroup;
  // table
  @ViewChild('table') table: APIDefinition | any;
  // edit
  @ViewChild('actionTpl', { static: true }) actionTpl?: TemplateRef<any>;
  @ViewChild('startDateTable', { static: true })
  startDateTable?: TemplateRef<any>;
  @ViewChild('endDateTable', { static: true }) endDateTable?: TemplateRef<any>;

  configuration: Config | any;
  columns: Columns[] = [];
  data: any[] = [];
  dataCopy: any[] = [];

  // allTutorials: ID_Name[] = [];

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
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');

    this.endDate = `${year}-${month}-${day}`;

    this.formData = this.fb.group({
      id: [''],
      numberOfPromoCodes: ['', [Validators.required]],
      discountPercentage: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: [this.endDate],
    });

    this.columns = [
      { key: 'promoCode', title: 'أسم كود الخصم' },
      {
        key: 'startDate',
        title: 'تاريخ بداية الخصم',
        cellTemplate: this.startDateTable,
      },
      {
        key: 'endDate',
        title: 'تاريخ نهاية الخصم',
        cellTemplate: this.endDateTable,
      },

      // { key: 'id', title: 'تعديل أو حذف', cellTemplate: this.actionTpl },
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

    this.fetchAllPromoCodes();
    // this.fetchAllTutorials();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // Search
  onChange(event: Event): void {
    this.table.apiEvent({
      type: API.onGlobalSearch,
      value: (event.target as HTMLInputElement).value,
    });
  }

  // fetchPromoCodeById(id: { id: number }): void {
  //   this.isLoading = true;
  //   this.promoService.getPromoCodeById(id).subscribe({
  //     next: ({ result, statusCode, msg }) => {
  //       if (statusCode == 200) {
  //         this.formData.patchValue({
  //           promoCode: result.promoCode,
  //           startDate: result.startDate,
  //           endDate: result.endDate,
  //           tutorialName: result.tutorialName,
  //         });
  //         this.isLoading = false;
  //       } else {
  //         this.toastr.error(msg);
  //         this.isLoading = false;
  //       }
  //     },
  //   });
  // }

  // edit fun
  // edit(promoCodeId: number): void {
  //   this.promoCodeId = promoCodeId;
  //   this.modal = true;
  //   this.formData.controls['id'].setValue(promoCodeId);

  //   if (promoCodeId > 0) {
  //     // this.fetchPromoCodeById({
  //     //   id: promoCodeId,
  //     // });
  //   }
  // }

  // Remove fun.
  remove(promoCodeId: number): void {
    this.isDelete = true;
    this.promoService
      .deletePromoCode({
        id: promoCodeId,
      })
      .subscribe({
        next: ({ statusCode, msg }) => {
          if (statusCode === 200) {
            this.apiCacheService.clearCache();
            this.fetchAllPromoCodes();
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

  fetchAllPromoCodes(): void {
    this.configuration.isLoading = true;
    this.promoService
      .getAllPromoCodes()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: ({ result, statusCode, msg }) => {
          if (statusCode === 200) {
            this.data = this.dataCopy = result;
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

  hideModal(): void {
    this.removeFormValidators();
    this.modal = false;
  }
  showModal(): void {
    this.formData.reset();
    this.formData.controls['id'].setValue(0);
    this.promoCodeId = 0;
    this.modal = true;
  }

  get promoCode(): AbstractControl | null {
    return this.formData.get('promoCode');
  }
  get date1(): AbstractControl | null {
    return this.formData.get('startDate');
  }
  get tutorialId(): AbstractControl | null {
    return this.formData.get('tutorial_id');
  }

  setFormValidators(): void {
    this.promoCode?.setValidators([Validators.required]);
    this.promoCode?.updateValueAndValidity();
    this.date1?.setValidators([Validators.required]);
    this.date1?.updateValueAndValidity();
    this.tutorialId?.setValidators([Validators.required]);
    this.tutorialId?.updateValueAndValidity();
  }
  removeFormValidators(): void {
    this.promoCode?.setValidators(null);
    this.promoCode?.updateValueAndValidity();
    this.date1?.setValidators(null);
    this.date1?.updateValueAndValidity();
    this.tutorialId?.setValidators(null);
    this.tutorialId?.updateValueAndValidity();
  }

  onSubmit() {
    this.setFormValidators();
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

    this.promoService.generateRandomPromoCodes(this.formData.value).subscribe({
      next: ({ msg, statusCode }) => {
        if (statusCode === 200) {
          this.toastr.success(msg);
          this.apiCacheService.clearCache();
          this.isLoading = false;
          this.modal = false;
          this.fetchAllPromoCodes();
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

  // fetchAllTutorials(): void {
  //   this.promoService.getAllTutorials().subscribe({
  //     next: ({ result, statusCode }) => {
  //       if (statusCode === 200) {
  //         this.allTutorials = result;
  //       }
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // }
}
