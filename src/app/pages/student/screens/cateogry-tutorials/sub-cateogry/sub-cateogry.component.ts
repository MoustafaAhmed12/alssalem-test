import { Component, OnInit, inject, signal } from '@angular/core';
import {
  ActivatedRoute,
  Event,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { TutorilsStudentsService } from '../../../services/tutorils-students.service';
import { CartComponent } from './cart/cart.component';
import { OnePackageComponent } from './one-package/one-package.component';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-sub-cateogry',
  standalone: true,
  imports: [CommonModule, CartComponent, OnePackageComponent, RouterLink],
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

  parentCategoryName: string = '';
  subCategoryName: string = '';

  qudrates: any;
  tahselis: any;
  qudrateEng: any;
  mawhooba: any;

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

    this.qudrates = [
      {
        id: 5,
        parentCategoryName: 'قدرات',
        img: './../../../../../../assets/imgs/قدرات/kami.png',
      },
      {
        id: 6,
        parentCategoryName: 'قدرات',
        img: './../../../../../../assets/imgs/قدرات/lafzi.png',
      },
    ];
    this.tahselis = [
      {
        id: 7,
        parentCategoryName: 'تحصيلي',
        img: './../../../../../../assets/imgs/تحصيلى/math.png',
      },
      {
        id: 8,
        parentCategoryName: 'تحصيلي',
        img: './../../../../../../assets/imgs/تحصيلى/physics.png',
      },
      {
        id: 9,
        parentCategoryName: 'تحصيلي',
        img: './../../../../../../assets/imgs/تحصيلى/chimestry.png',
      },
      {
        id: 10,
        parentCategoryName: 'تحصيلي',
        img: './../../../../../../assets/imgs/تحصيلى/bio.png',
      },
    ];
    this.qudrateEng = [
      {
        id: 11,
        parentCategoryName: 'قدارت باللغه الانجليزية',
        img: './../../../../../../assets/imgs/قدرات انجليزى/Verbal.png',
      },
      {
        id: 12,
        parentCategoryName: 'قدارت باللغه الانجليزية',
        img: './../../../../../../assets/imgs/قدرات انجليزى/Quantitative.png',
      },
    ];

    this.mawhooba = [
      {
        id: 13,
        name: 'كنجارو',
        parentCategoryName: 'موهبة',
        img: './../../../../../../assets/imgs/موهبة/kangaro.png',
      },

      {
        id: 14,
        name: 'موهوب',
        parentCategoryName: 'موهبة',
        img: './../../../../../../assets/imgs/موهبة/mawhoob.png',
      },
      {
        id: 16,
        name: 'أولمبياد الرياضيات',
        parentCategoryName: 'موهبة',
        img: './../../../../../../assets/imgs/موهبة/olimbics.png',
      },
      {
        id: 15,
        name: 'البرنامج الوطني للكشف عن الموهوبين',
        parentCategoryName: 'موهبة',
        img: './../../../../../../assets/imgs/موهبة/mawhobeen.png',
      },
    ];
  }

  goToProductDetail(courseId: string): void {
    this.router.navigate(['/courses', courseId]);
  }

  fetchCustomCategoryTutorials(id: { id: number }): void {
    this.isLoading.set(true);
    this.tutorilsStudentsService.getCustomCategoryTutorials(id).subscribe({
      next: ({ statusCode, result, msg }) => {
        if (statusCode === 200) {
          if (result.isTutorial === false) {
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
