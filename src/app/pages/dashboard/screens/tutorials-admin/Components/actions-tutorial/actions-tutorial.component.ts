import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ID_Name, Tutorial } from '../../../../model/admin-model';
import { TutorialService } from '../../../../services/tutorial.service';
import { CategoryService } from '../../../../services/category.service';
import { ApiCacheService } from '../../../../../../shared/services/api-cache.service';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-actions-tutorial',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    RouterLink,
    NgSelectModule,
  ],
  templateUrl: './actions-tutorial.component.html',
  styleUrl: './actions-tutorial.component.scss',
})
export class ActionsTutorialComponent implements OnInit {
  categoryService = inject(CategoryService);
  tutorialService = inject(TutorialService);
  apiCacheService = inject(ApiCacheService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  tutorialId: number = 0;
  allTeachers: ID_Name[] = [];
  allQuestionTypes: ID_Name[] = [];
  allCategory: ID_Name[] = [];

  submitted = false;
  isLoading: boolean = false;
  previewImageUrl: string = '';
  base64Image: any = '';
  formData!: FormGroup;
  constructor() {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.tutorialId = parseInt(params['id']);
      if (this.tutorialId > 0) {
        this.fetchTutorial({
          id: this.tutorialId,
        });
      }
    });

    this.formData = this.formBuilder.group({
      id: [this.tutorialId === 0 ? 0 : this.tutorialId],
      name: ['', [Validators.required]],
      teacherId: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
      description: ['', [Validators.required]],
      priceBeforeDiscount: ['', [Validators.required]],
      price: ['', [Validators.required]],
      durationInWeeks: ['', [Validators.required]],
      fakeStudentsEnrolled: [''],

      questionTypes: [[], [Validators.required]],

      isEnabled: [null, [Validators.required]],
      isBuyAgain: [null],
      img: [''],
    });

    // all Teacher
    this.fetchAllTeachers();

    // all Category
    this.fetchAllCategories();

    // all allQuestionTypes
    this.fetchAllQuestionTypes();
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.convertToBase64(file);
    }
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.convertToBase64(files[0]);
    }
  }

  convertToBase64(file: File) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const imgbase = reader.result;
      console.log(imgbase);
      this.formData.get('img')?.patchValue(imgbase);
      this.previewImageUrl = reader.result as string;
    };
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onSubmit() {
    this.submitted = true;
    if (this.formData.invalid) {
      return;
    }
    if (this.formData.value.priceBeforeDiscount < this.formData.value.price) {
      this.toastr.info('تأكد أن سعر قبل الخصم اكبر من سعر البيع');
      return;
    }
    this.isLoading = true;

    this.tutorialService.createTutorial(this.formData.value).subscribe({
      next: ({ statusCode, msg }) => {
        if (statusCode === 200) {
          this.toastr.success(msg);
          this.isLoading = false;
          this.apiCacheService.clearCache();
          this.router.navigateByUrl('/admin/tutorial');
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

  fetchTutorial(tutorialId: any): void {
    this.isLoading = true;
    this.tutorialService.getTutorialById(tutorialId).subscribe({
      next: ({ statusCode, result, msg }) => {
        if (statusCode == 200) {
          const tutorial = result as Tutorial;
          this.previewImageUrl = tutorial.img;
          this.isLoading = false;
          this.formData.patchValue({
            name: tutorial.name,
            teacherId: tutorial.teacherId,
            categoryId: tutorial.categoryId,
            description: tutorial.description,
            priceBeforeDiscount: tutorial.priceBeforeDiscount,
            price: tutorial.price,
            durationInWeeks: tutorial.durationInWeeks,
            fakeStudentsEnrolled: tutorial.fakeStudentsEnrolled,
            isEnabled: tutorial.isEnabled,
            isBuyAgain: tutorial.isBuyAgain,
            questionTypes: tutorial.questionTypeIds,
          });
        } else {
          this.toastr.error(msg);
          this.isLoading = false;
        }
      },
    });
  }

  // get All Teachers
  fetchAllTeachers(): void {
    this.tutorialService.getAllTeachers().subscribe({
      next: ({ result, statusCode }) => {
        if (statusCode === 200) {
          this.allTeachers = result;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  fetchAllCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: ({ result, statusCode }) => {
        if (statusCode === 200) {
          this.allCategory = result;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // QuestionTypes
  fetchAllQuestionTypes(): void {
    this.tutorialService.getQuestionTypes().subscribe({
      next: ({ result, statusCode }) => {
        if (statusCode === 200) {
          this.allQuestionTypes = result;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
