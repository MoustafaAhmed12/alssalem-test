import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  ActivatedRoute,
  Event,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { ContentOfCourseComponent } from './content-of-course/content-of-course.component';
import { CommonModule, ViewportScroller } from '@angular/common';
import { TutorilsStudentsService } from '../../services/tutorils-students.service';
import { AuthService } from '../../../../authentication/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommentsStudentComponent } from '../cateogry-tutorials/comments-student/comments-student.component';
import {
  Comment,
  TutorialDetails,
  Unit,
} from '../../model/all-tutorial-details';
import { environment } from '../../../../../environments/environment';
import { ExamsCourseComponent } from './exams-course/exams-course.component';

@Component({
  selector: 'app-course-page',
  standalone: true,
  imports: [
    CommonModule,
    ContentOfCourseComponent,
    CommentsStudentComponent,
    RouterLink,
    ExamsCourseComponent,
  ],
  templateUrl: './course-page.component.html',
  styleUrl: './course-page.component.scss',
  animations: [
    trigger('tabContentAnimation', [
      state(
        'inactive',
        style({
          opacity: 0,
          transform: 'translateX(-100%)',
        })
      ),
      state(
        'active',
        style({
          opacity: 1,
          transform: 'translateX(0)',
        })
      ),
      transition('inactive => active', [animate('300ms ease-in')]),
      transition('active => inactive', [animate('300ms ease-out')]),
    ]),
  ],
})
export class CoursePageComponent implements OnInit {
  tutorilsStudentsService = inject(TutorilsStudentsService);
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  viewportScroller = inject(ViewportScroller);
  isAuth: boolean = false;
  currentUser: any;
  isLoading = signal<boolean>(false);

  tutorialId: number = 0;
  tutorialDetails!: TutorialDetails;
  allUnits: Unit[] = [];
  comments: Comment[] = [];

  selectedTab = 0;
  logo = environment.logo;

  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    });
    this.isAuth = this.authService.isAuth();
    this.currentUser = this.authService.currentUser()?.userDto;
    this.route.params.subscribe((params) => {
      this.tutorialId = parseInt(params['tutorialId']);
      if (this.tutorialId && this.isAuth === true) {
        this.fetchStudentTutorialById({
          tutorialId: this.tutorialId,
          userId: this.currentUser.id,
        });
      }
      if (this.isAuth === false) {
        this.fetchStudentTutorialById({
          tutorialId: this.tutorialId,
          userId: 0,
        });
      }
    });
  }

  tabs = [
    { label: 'وصف الدورة' },
    { label: 'منهج الدورة' },
    { label: 'ملفات الدورة' },
  ];

  selectTab(index: number) {
    this.selectedTab = index;
  }

  fetchStudentTutorialById(tutorialIdAndUserId: any): void {
    this.isLoading.set(true);
    this.tutorilsStudentsService
      .getStudentTutorialById(tutorialIdAndUserId)
      .subscribe({
        next: ({ statusCode, result, msg }) => {
          if (statusCode === 200) {
            this.tutorialDetails = result;
            this.allUnits = this.tutorialDetails.units;
            this.comments = this.tutorialDetails.comments;
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
