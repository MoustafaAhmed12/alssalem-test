import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { TutorilsStudentsService } from '../../../services/tutorils-students.service';
import { CartComponent } from './cart/cart.component';
import { OnePackageComponent } from './one-package/one-package.component';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-sub-cateogry',
  standalone: true,
  imports: [CommonModule, CartComponent, OnePackageComponent],
  templateUrl: './sub-cateogry.component.html',
  styleUrl: './sub-cateogry.component.scss',
})
export class SubCateogryComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  viewportScroller = inject(ViewportScroller);
  tutorilsStudentsService = inject(TutorilsStudentsService);
  toastr = inject(ToastrService);
  subCategories: any = [];
  categoryTutorials: any = [];

  isTutorial: boolean = false;
  parentCategoryName: string = '';
  subCategoryName: string = '';

  id: number = 0;
  isLoading = signal<boolean>(false);
  logo = environment.logo;

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });
    this.route.params.subscribe((params) => {
      this.id = parseInt(params['id']);
      if (this.id) {
        this.fetchCustomCategoryTutorials({ id: this.id });
      }
    });
  }

  goToProductDetail(courseId: string): void {
    this.router.navigate(['/courses', courseId]);
  }

  fetchCustomCategoryTutorials(id: { id: number }): void {
    this.isLoading.set(true);
    this.tutorilsStudentsService.getCustomCategoryTutorials(id).subscribe({
      next: ({ statusCode, result, msg }) => {
        if (statusCode === 200) {
          this.isTutorial = result.isTutorial;
          if (this.isTutorial === false) {
            this.subCategories = result.subCategories;
            this.parentCategoryName =
              result.subCategories[0].parentCategoryName;
          }
          this.isLoading.update((v) => (v = false));
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
}
