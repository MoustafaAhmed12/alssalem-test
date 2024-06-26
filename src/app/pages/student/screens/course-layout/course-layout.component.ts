import { NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { NavBarCourseComponent } from './nav-bar-course/nav-bar-course.component';
import { ContentOfCourseComponent } from '../course-page/content-of-course/content-of-course.component';
import { NavberServiceService } from '../../../../shared/services/navber-service.service';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { TutorilsStudentsService } from '../../services/tutorils-students.service';
import { AuthService } from '../../../../authentication/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import {
  Detail,
  TutorialDetails,
  Unit,
} from '../../model/all-tutorial-details';
import { environment } from '../../../../../environments/environment';
import { ExamsCourseComponent } from '../course-page/exams-course/exams-course.component';

@Component({
  selector: 'app-course-layout',
  standalone: true,
  imports: [
    NgClass,
    NavBarCourseComponent,
    ContentOfCourseComponent,
    RouterOutlet,
    ExamsCourseComponent,
  ],
  templateUrl: './course-layout.component.html',
  styleUrl: './course-layout.component.scss',
})
export class CourseLayoutComponent implements OnInit, OnDestroy {
  tutorilsStudentsService = inject(TutorilsStudentsService);
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);
  isAuth: boolean = false;
  currentUser: any;
  isLoading = signal<boolean>(false);

  tutorialId: number = 0;
  tutorialName: string = '';
  allUnit: Unit[] = [];
  ExamsTutorial: any;
  detailsUnit: Detail[] = [];
  isShow: boolean = true;
  navberService = inject(NavberServiceService);
  logo = environment.logo;

  show_menu(): void {
    this.isShow = !this.isShow;
  }

  ngOnInit() {
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
    this.navberService.hide();
  }

  ngOnDestroy() {
    this.navberService.display();
  }

  fetchStudentTutorialById(tutorialIdAndUserId: any): void {
    this.isLoading.set(true);
    this.tutorilsStudentsService
      .getStudentTutorialById(tutorialIdAndUserId)
      .subscribe({
        next: ({ statusCode, result, msg }) => {
          if (statusCode === 200) {
            const tutorialConetent = result as TutorialDetails;
            this.tutorialName = tutorialConetent.name;
            this.allUnit = tutorialConetent.units;
            this.detailsUnit = result.units.details;
            this.ExamsTutorial = result.exams;

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
