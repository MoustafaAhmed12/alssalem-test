import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/screens/login/login.component';
import { authGuard, authGuardLoggdIn } from './authentication/guard/auth.guard';
import { RegisterComponent } from './authentication/screens/register/register.component';
import { rolesGuard } from './shared/guard/roles.guard';
// Admin
import { LayAdminComponent } from './layouts/lay-admin/lay-admin.component';
import { AdminHomeComponent } from './pages/dashboard/screens/admin-home/admin-home.component';
import { StudentAdminComponent } from './pages/dashboard/screens/student-admin/student-admin.component';
import { SchoolAdminComponent } from './pages/dashboard/screens/school-admin/school-admin.component';
import { UsersAdminComponent } from './pages/dashboard/screens/users-admin/users-admin.component';
import { ContainerActionsComponent } from './pages/dashboard/screens/users-admin/components/container-actions/container-actions.component';
import { PaymentAdminComponent } from './pages/dashboard/screens/payment-admin/payment-admin.component';
import { TutorialsAdminComponent } from './pages/dashboard/screens/tutorials-admin/tutorials-admin.component';

// Student
import { LayStudentComponent } from './layouts/lay-student/lay-student.component';
import { HomeComponent } from './pages/student/screens/home/home.component';
import { ProfileComponent } from './pages/student/screens/profile/profile.component';
import { AboutUsComponent } from './pages/student/screens/about-us/about-us.component';
import { CoursePageComponent } from './pages/student/screens/course-page/course-page.component';

// Supervisor
import { HomeInstructorComponent } from './pages/instructor/screens/home-instructor/home-instructor.component';

//Instructor
import { HomeSupervisorComponent } from './pages/supervisor/screens/home-supervisor/home-supervisor.component';
import { CategorySectionComponent } from './pages/dashboard/screens/category-section/category-section.component';
import { ActionsTutorialComponent } from './pages/dashboard/screens/tutorials-admin/Components/actions-tutorial/actions-tutorial.component';
import { SettingProfileComponent } from './pages/dashboard/components/setting-profile/setting-profile.component';
import { ExamsComponent } from './pages/instructor/screens/exams/exams.component';
import { ActionsExamComponent } from './pages/instructor/screens/actions-exam/actions-exam.component';
import { TutorialTeacherComponent } from './pages/instructor/screens/tutorial-teacher/tutorial-teacher.component';
import { EditTutorialComponent } from './pages/instructor/screens/edit-tutorial/edit-tutorial.component';
import { HomeParentComponent } from './pages/parent/screens/home-parent/home-parent.component';
import { PackageTutorialComponent } from './pages/dashboard/screens/package-tutorial/package-tutorial.component';
import { ActionsPackageComponent } from './pages/dashboard/screens/package-tutorial/actions-package/actions-package.component';
import { AllVideosComponent } from './pages/instructor/screens/all-videos/all-videos.component';
import { CateogryTutorialsComponent } from './pages/student/screens/cateogry-tutorials/cateogry-tutorials.component';
import { SubCateogryComponent } from './pages/student/screens/cateogry-tutorials/sub-cateogry/sub-cateogry.component';
import { CourseLayoutComponent } from './pages/student/screens/course-layout/course-layout.component';
import { TestLessonComponent } from './pages/student/screens/course-layout/test-lesson/test-lesson.component';
import { VideoLessonComponent } from './pages/student/screens/course-layout/video-lesson/video-lesson.component';
import { CommentsAdminComponent } from './pages/dashboard/screens/comments-admin/comments-admin.component';
import { ParentRegisterComponent } from './authentication/screens/parent-register/parent-register.component';
import { PromoCodesComponent } from './pages/dashboard/screens/promo-codes/promo-codes.component';
import { CheckoutComponent } from './pages/student/screens/checkout/checkout.component';
import { AllAttachmentsComponent } from './pages/instructor/screens/all-attachments/all-attachments.component';
import { PagenotfoundComponent } from './pages/pagenotfound/pagenotfound.component';
import { QuestionTypesComponent } from './pages/dashboard/screens/question-types/question-types.component';

export const routes: Routes = [
  // Auth Pages
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authGuardLoggdIn],
    title: 'تسجل الدخول | السالم',
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [authGuardLoggdIn],
    title: 'التسجل | السالم',
  },
  {
    path: 'parent-register',
    component: ParentRegisterComponent,
    canActivate: [authGuardLoggdIn],
    title: 'تسجيل ولي الأمر | السالم',
  },

  // Stutent Pages
  {
    path: '',
    component: LayStudentComponent,
    canActivate: [],

    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'sub-cateogry/:id',
        component: SubCateogryComponent,
      },
      {
        path: 'cateogry-tutorials',
        children: [
          {
            path: ':cateogryId',
            component: CateogryTutorialsComponent,
          },
          {
            path: ':cateogryId',
            children: [
              {
                path: 'tutorial/:tutorialId',
                component: CoursePageComponent,
              },
            ],
          },
          {
            path: ':cateogryId/tutorial/:tutorialId',
            children: [
              {
                path: '',
                component: CourseLayoutComponent,
                children: [
                  {
                    path: 'lesson/:id',
                    component: VideoLessonComponent,
                  },
                  {
                    path: 'exam/:examId',
                    component: TestLessonComponent,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: 'checkout',
        component: CheckoutComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard],
      },
      {
        path: 'about-us',
        component: AboutUsComponent,
      },
    ],
  },

  // Admin Pages
  {
    path: 'admin',
    component: LayAdminComponent,
    canActivate: [authGuard, rolesGuard],
    children: [
      {
        path: '',
        title: 'لوحة تحكم - السالم',
        component: AdminHomeComponent,
      },
      {
        path: 'category',
        component: CategorySectionComponent,
      },
      {
        path: 'users',
        title: 'لوحة تحكم / المستخدمين - السالم',

        component: UsersAdminComponent,
      },
      {
        path: 'users',
        children: [
          {
            path: ':id',
            component: ContainerActionsComponent,
          },
        ],
      },
      {
        path: 'student',
        title: 'لوحة تحكم / الطلاب - السالم',
        component: StudentAdminComponent,
      },
      {
        path: 'school',
        title: 'لوحة تحكم / المدارس - السالم',
        component: SchoolAdminComponent,
      },
      {
        path: 'tutorial',
        title: 'لوحة تحكم / الدورات - السالم',
        component: TutorialsAdminComponent,
      },
      {
        path: 'tutorial',
        children: [
          {
            path: ':id',
            component: ActionsTutorialComponent,
          },
        ],
      },
      {
        path: 'package-tutorials',
        title: 'لوحة تحكم / الدورات - السالم',
        component: PackageTutorialComponent,
      },
      {
        path: 'package-tutorials',
        children: [
          {
            path: ':id',
            component: ActionsPackageComponent,
          },
        ],
      },
      {
        path: 'payment',
        title: 'لوحة تحكم / عمليات الدفع - السالم',
        component: PaymentAdminComponent,
      },
      {
        path: 'comments',
        title: 'لوحة تحكم / جميع التعليقات - السالم',
        component: CommentsAdminComponent,
      },
      {
        path: 'promo-code',
        title: 'لوحة تحكم / اكواد الخصم - السالم',
        component: PromoCodesComponent,
      },
      {
        path: 'questions-type',
        title: 'لوحة تحكم / نوع الاسئلة - السالم',
        component: QuestionTypesComponent,
      },
      {
        path: 'settings-profile',
        title: 'لوحة تحكم / اعدادات الملف - السالم',
        component: SettingProfileComponent,
      },
    ],
  },

  // Teacher and Data Entry Pages
  {
    path: 'instructor',
    component: LayAdminComponent,
    canActivate: [authGuard, rolesGuard],
    children: [
      {
        path: '',
        title: 'لوحة تحكم- المدرس / الدورات - السالم',
        component: TutorialTeacherComponent,
      },
      // {
      //   path: 'tutorial',
      //   title: 'لوحة تحكم- المدرس / الدورات - السالم',
      //   component: TutorialTeacherComponent,
      // },
      {
        path: 'attachments',
        title: 'لوحة تحكم- المدرس / الملفات - السالم',
        component: AllAttachmentsComponent,
      },
      {
        path: 'videos',
        title: 'لوحة تحكم- المدرس / الفيديوهات - السالم',
        component: AllVideosComponent,
      },
      {
        path: 'edit-tutorial',
        title: 'لوحة تحكم- المدرس / اضافة درس - السالم',
        children: [
          {
            path: ':id',
            component: EditTutorialComponent,
          },
        ],
      },
      {
        path: 'exams',
        title: 'لوحة تحكم- المدرس / امتحانات - السالم',
        component: ExamsComponent,
      },
      {
        path: 'exams',
        children: [
          {
            path: ':id',
            component: ActionsExamComponent,
          },
          {
            path: '0',
            title: 'لوحة تحكم- المدرس / اضافة امتحان - السالم',
            component: ActionsExamComponent,
          },
        ],
      },

      {
        path: 'settings-profile',
        component: SettingProfileComponent,
      },
    ],
  },

  // Supervisor Pages
  {
    path: 'supervisor',
    component: HomeSupervisorComponent,
    title: ' مشرف المدرسة - السالم',
    canActivate: [authGuard, rolesGuard],
    // children: [
    //   {
    //     path: '',
    //     component: ParentComponent,
    //   },
    // ],
  },
  // parent Pages
  {
    path: 'parent',
    component: HomeParentComponent,
    title: ' ولي الأمر - السالم',
    canActivate: [authGuard, rolesGuard],
    // children: [
    //   {
    //     path: '',
    //     component: ParentComponent,
    //   },
    // ],
  },

  { path: '**', pathMatch: 'full', component: PagenotfoundComponent },
];
