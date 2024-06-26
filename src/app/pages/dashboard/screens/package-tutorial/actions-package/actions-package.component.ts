import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { ApiCacheService } from '../../../../../shared/services/api-cache.service';
import { PackageTutorialService } from '../../../services/package-tutorial.service';
import { ID_Name } from '../../../model/admin-model';

@Component({
  selector: 'app-actions-package',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    RouterLink,
    NgSelectModule,
    CommonModule,
  ],
  templateUrl: './actions-package.component.html',
  styleUrl: './actions-package.component.scss',
})
export class ActionsPackageComponent implements OnInit {
  packageTutorialService = inject(PackageTutorialService);
  apiCacheService = inject(ApiCacheService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  toastr = inject(ToastrService);
  packageId: number = 0;
  allTutorials: ID_Name[] = [];

  submitted = false;
  isLoading: boolean = false;
  previewImageUrl: string = '';
  base64Image: any = '';
  formData!: FormGroup;
  totalPriceBeforDiscount: number = 0;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.packageId = parseInt(params['id']);
      if (this.packageId > 0) {
        this.fetchPackageById({
          packageId: this.packageId,
        });
      }
    });

    this.formData = this.fb.group({
      id: [this.packageId === 0 ? 0 : this.packageId],
      name: ['', [Validators.required]],
      tutorialId: [null, [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required]],

      img: [''],
    });

    this.fetchAllTutorials();
  }

  onFileSelected(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      reader.onload = () => {
        this.base64Image = reader.result;
        this.formData.get('img')?.patchValue(this.base64Image);
        this.previewImageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSelectedTutorails(items: any) {
    this.totalPriceBeforDiscount = items.reduce(
      (accumulator: number, { price }: any) => {
        return accumulator + price;
      },
      0
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.formData.invalid) {
      return;
    }
    if (this.totalPriceBeforDiscount < this.formData.value.price) {
      this.toastr.info('تأكد أن سعر قبل الخصم اكبر من سعر البيع');
      return;
    }
    this.isLoading = true;

    this.packageTutorialService.savePackage(this.formData.value).subscribe({
      next: ({ statusCode, msg }) => {
        if (statusCode === 200) {
          this.toastr.success(msg);
          this.isLoading = false;
          this.apiCacheService.clearCache();
          this.router.navigateByUrl('/admin/package-tutorials');
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

  fetchPackageById(packageId: any): void {
    this.isLoading = true;
    this.packageTutorialService.getPackageById(packageId).subscribe({
      next: ({ statusCode, result, msg }) => {
        if (statusCode == 200) {
          const packageTutorial = result;
          this.previewImageUrl = packageTutorial.img;
          this.isLoading = false;
          this.formData.patchValue({
            id: packageTutorial.id,
            name: packageTutorial.name,
            tutorialId: packageTutorial.tutorialId,
            description: packageTutorial.description,
            price: packageTutorial.price,
            isActive: packageTutorial.isActive,
          });
          this.totalPriceBeforDiscount = packageTutorial.totalPrice;
        } else {
          this.toastr.error(msg);
          this.isLoading = false;
        }
      },
    });
  }

  // get All System Tutorials
  fetchAllTutorials(): void {
    this.packageTutorialService.getAllSystemTutorials().subscribe({
      next: ({ result, statusCode }) => {
        if (statusCode === 200) {
          this.allTutorials = result;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
