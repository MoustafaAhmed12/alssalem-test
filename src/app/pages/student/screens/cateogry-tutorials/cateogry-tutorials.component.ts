import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';
import { TutorilsStudentsService } from '../../services/tutorils-students.service';
import { CourseCardComponent } from './course-card/course-card.component';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-cateogry-tutorials',
  standalone: true,
  imports: [CourseCardComponent, CommonModule],
  templateUrl: './cateogry-tutorials.component.html',
  styleUrl: './cateogry-tutorials.component.scss',
})
export class CateogryTutorialsComponent implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  viewportScroller = inject(ViewportScroller);
  tutorilsStudentsService = inject(TutorilsStudentsService);
  toastr = inject(ToastrService);
  id: number = 0;
  isTutorial: boolean = false;
  categoryTutorials: any = [];
  subCategoryName: string = '';
  isLoading = signal<boolean>(false);
  isShow: boolean = false;
  listView: boolean = true;
  logo = environment.logo;

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });
    this.route.params.subscribe((params) => {
      this.id = parseInt(params['cateogryId']);
      if (this.id) {
        this.fetchCustomCategoryTutorials({ id: this.id });
      }
    });
  }

  onShow() {
    this.isShow = !this.isShow;
  }

  // ViewList(): void {
  //   this.listView = true;
  // }
  // ViewGrid(): void {
  //   this.listView = false;
  // }

  fetchCustomCategoryTutorials(id: { id: number }): void {
    this.isLoading.set(true);
    this.tutorilsStudentsService.getCustomCategoryTutorials(id).subscribe({
      next: ({ statusCode, result, msg }) => {
        if (statusCode === 200) {
          this.categoryTutorials = result?.tutorials;
          this.subCategoryName = result.tutorials[0]?.subCategoryName;
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
