import { NgClass } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../../authentication/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SideItemComponent } from '../side-item/side-item.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faHome,
  faBorderAll,
  faUsersCog,
  faUserGraduate,
  faSchool,
  faMoneyBill1Wave,
  faQuestionCircle,
  faPlusCircle,
  faUserCircle,
  faGear,
  faShapes,
  faComments,
  faFilePen,
  faCode,
} from '@fortawesome/free-solid-svg-icons';
import { SidebarMobileComponent } from '../sidebar-mobile/sidebar-mobile.component';
@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    RouterLinkActive,
    SideItemComponent,
    SidebarMobileComponent,
    FontAwesomeModule,
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent implements OnInit {
  authService = inject(AuthService);
  currentUser: any;
  role: any;

  isShow: boolean = false;
  // menu_show: boolean = true;

  show_menu(): void {
    this.isShow = !this.isShow;
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser().userDto;
    this.role = this.authService.currentUser().roleDto.roleName;
  }

  itemsAdmin: any = [
    {
      lable: 'لوحة التحكم',
      link: '/admin',
      icon: faHome,
    },
    // {
    //   lable: 'التصنيف',
    //   link: '/admin/category',
    //   icon: faShapes,
    // },
    {
      lable: 'الدورات',
      link: '/admin/tutorial',
      icon: faBorderAll,
    },

    {
      lable: 'المستخدمين',
      link: '/admin/users',
      icon: faUsersCog,
    },
    {
      lable: 'الطلاب',
      link: '/admin/student',
      icon: faUserGraduate,
    },
    {
      lable: 'بكدج الدورات',
      link: '/admin/package-tutorials',
      icon: faBorderAll,
    },
    {
      lable: 'المدرسة',
      link: '/admin/school',
      icon: faSchool,
    },
    {
      lable: 'عمليات الدفع',
      link: '/admin/payment',
      icon: faMoneyBill1Wave,
    },
    {
      lable: 'التعليقات',
      link: '/admin/comments',
      icon: faComments,
    },
    {
      lable: 'أكواد الخصم',
      link: '/admin/promo-code',
      icon: faCode,
    },
    {
      lable: 'نوع الأسئلة',
      link: '/admin/questions-type',
      icon: faQuestionCircle,
    },
  ];

  itemsEntry: any = [
    {
      lable: 'الامتحانات',
      link: '/instructor/exams',
      icon: faUserGraduate,
    },
    {
      lable: 'الأسئلة',
      link: '/instructor/Question',
      icon: faQuestionCircle,
    },
  ];

  itemsTeacher: any = [
    {
      lable: 'الدورات',
      link: '/instructor',
      icon: faBorderAll,
    },

    {
      lable: ' الملفات',
      link: '/instructor/attachments',
      icon: faPlusCircle,
    },
    {
      lable: ' الفيديوهات',
      link: '/instructor/videos',
      icon: faPlusCircle,
    },
    {
      lable: 'الامتحانات',
      link: '/instructor/exams',
      icon: faFilePen,
    },
    {
      lable: 'اضافة امتحان',
      link: '/instructor/exams/0',
      icon: faPlusCircle,
    },
    // {
    //   lable: 'الأسئلة',
    //   link: '/instructor/Question',
    //   icon: faQuestionCircle,
    // },
  ];

  itemsSettingAdmin: any = [
    {
      lable: 'الملف الشخصي',
      link: '/admin/profile',
      icon: faUserCircle,
    },
    {
      lable: 'إعدادات',
      link: '/admin/settings-profile',
      icon: faGear,
    },
  ];
  itemsSettingTeacher: any = [
    {
      lable: 'الملف الشخصي',
      link: '/instructor/profile',
      icon: faUserCircle,
    },
    {
      lable: 'إعدادات',
      link: '/instructor/settings-profile',
      icon: faGear,
    },
  ];
}
