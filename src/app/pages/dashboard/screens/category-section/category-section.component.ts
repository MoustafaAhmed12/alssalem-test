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
import { NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryInfo } from '../../model/admin-model';
import { CategoryService } from '../../services/category.service';
import { ApiCacheService } from '../../../../shared/services/api-cache.service';

@Component({
  selector: 'app-category-section',
  standalone: true,
  imports: [TableModule, ReactiveFormsModule, NgClass],
  templateUrl: './category-section.component.html',
  styleUrl: './category-section.component.scss',
})
export class CategorySectionComponent implements OnInit {
  toastr = inject(ToastrService);
  categoryService = inject(CategoryService);
  apiCacheService = inject(ApiCacheService);

  categoryId: number = 0;
  isLoading: boolean = false;
  submitted = false;
  modal: boolean = false;

  formData: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
    isVisibleToFront: new FormControl(),
  });

  // table
  @ViewChild('table') table: APIDefinition | any;
  // edit
  @ViewChild('actionTpl', { static: true }) actionTpl?: TemplateRef<any>;
  @ViewChild('actionToggle', { static: true }) actionToggle?: TemplateRef<any>;

  public configuration: Config | any;
  public columns: Columns[] = [];
  public data: CategoryInfo[] = [];
  dataCopy: CategoryInfo[] = [];

  /// loading
  public pagination = {
    limit: 10,
    offset: 0,
    count: -1,
  };
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      id: [''],
      name: [
        '',
        [
          Validators.required,
          // Validators.pattern('^[\u0621-\u064A\u0660-\u0669.\\-_ًٍَُِ~ٌّْ ]+$'),
        ],
      ],
      isVisibleToFront: ['', [Validators.required]],
    });

    this.columns = [
      { key: 'name', title: 'أسم الصنيف' },
      {
        key: 'isVisibleToFront',
        title: 'ظهور او اخفاء',
        cellTemplate: this.actionToggle,
      },

      { key: 'id', title: 'تعديل', cellTemplate: this.actionTpl },
    ];

    this.configuration = { ...DefaultConfig };

    // max size for pagination === 7
    this.configuration.paginationMaxSize = 7;
    // this.configuration.fixedColumnWidth = false;
    this.configuration.rows = 5;
    this.configuration.tableLayout = {
      striped: true,
      hover: true,
      theme: 'light',
    };
    // this.configuration.checkboxes = true;

    this.configuration.horizontalScroll = true;

    this.fetchAllCateogrys();
  }

  selectionChangedForIsVisibleToFront(event: any) {
    let option = event.target.value;
    this.formData.controls['isVisibleToFront'].clearValidators();

    if (option == false) {
      this.formData.controls['isVisibleToFront'].setValidators([
        Validators.required,
      ]);
    }
    if (option == true) {
      this.formData.controls['isVisibleToFront'].setValidators([
        Validators.required,
      ]);
    }

    this.formData.updateValueAndValidity();
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

  // edit fun
  edit(categoryId: number): void {
    this.categoryId = categoryId;
    this.modal = true;
    this.formData.controls['id'].setValue(categoryId);

    const objCategory = {
      id: categoryId,
    };
    if (categoryId > 0) {
      this.fetchCateogry(objCategory);
    }
  }

  fetchCateogry(categoryId: any): void {
    this.isLoading = true;
    this.categoryService.getCateogryById(categoryId).subscribe({
      next: ({ result, statusCode, msg }) => {
        if (statusCode == 200) {
          let category = result as CategoryInfo;
          this.formData.patchValue({
            name: category.name,
            isVisibleToFront: category.isVisibleToFront,
          });
          this.isLoading = false;
        } else {
          this.toastr.error(msg);
          this.isLoading = false;
        }
      },
    });
  }

  private fetchAllCateogrys(): void {
    this.configuration.isLoading = true;
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: ({ result, isSuccess, statusCode, msg }) => {
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

  get name(): AbstractControl | null {
    return this.formData.get('name');
  }

  showModal(): void {
    this.formData.reset();
    this.formData.controls['id'].setValue(0);
    this.categoryId = 0;

    this.modal = true;
  }

  hideModal(): void {
    this.name?.setValidators(null);

    this.name?.updateValueAndValidity();
    this.modal = false;
  }

  onSubmit() {
    this.name?.setValidators([Validators.required]);
    this.name?.updateValueAndValidity();
    this.submitted = true;
    if (this.formData.invalid) {
      return;
    }
    this.isLoading = true;
    this.formData.value.isVisibleToFront = /^true$/i.test(
      this.formData.value.isVisibleToFront
    );

    this.categoryService.saveCategory(this.formData.value).subscribe({
      next: ({ msg, statusCode }) => {
        if (statusCode === 200) {
          this.toastr.success(msg);
          this.apiCacheService.clearCache();
          this.fetchAllCateogrys();
          this.isLoading = false;
          this.modal = false;
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
}
