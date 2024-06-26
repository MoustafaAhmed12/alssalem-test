import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import { AuthService } from '../../../authentication/services/auth.service';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NavbarItemComponent } from '../navbar-item/navbar-item.component';

export interface Category {
  id: number;
  name: string;
  children?: Category[];
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    NavbarItemComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  AllCateories: Category[] = [];
  router = inject(Router);
  isAuth: boolean = false;
  currentUser: any;
  mobile_menu_show = false;
  menu_show_Profile = false;
  isScrolled: boolean = false;
  /// env
  mainColorText: string = environment.mainColorText;
  mainColorBg: string = environment.mainColorBg;
  mainColorBgHover: string = environment.mainColorBgHover;
  secondaryColorBg: string = environment.secondaryColorBg;

  secondaryColorTextHover: string = environment.secondaryColorTextHover;
  secondaryColorBorder: string = environment.secondaryColorBorder;
  secondaryColorBorderHover: string = environment.secondaryColorBorderHover;

  logo: string = environment.logo;
  mobile_menu_button() {
    this.mobile_menu_show = !this.mobile_menu_show;
  }
  menu_Profile() {
    this.menu_show_Profile = true;
  }
  menu_Profile_close() {
    this.menu_show_Profile = false;
  }
  mobile_menu_clase() {
    this.mobile_menu_show = false;
  }

  ngOnInit(): void {
    this.isAuth = this.authService.isAuth();
    this.currentUser = this.authService.currentUser()?.userDto;
    this.AllCateories = [
      {
        id: 1,
        name: 'قدرات',
        children: [
          {
            id: 5,
            name: 'قدرات كمي',
            children: [],
          },
          {
            id: 6,
            name: 'قدرات لفظي',
            children: [],
          },
        ],
      },
      {
        id: 2,
        name: 'تحصيلي',
        children: [
          {
            id: 7,
            name: 'تحصيلي رياضيات',
            children: [],
          },
          {
            id: 8,
            name: 'تحصيلي فيزياء',
            children: [],
          },
          {
            id: 9,
            name: 'تحصيلي كيمياء',
            children: [],
          },
          {
            id: 10,
            name: 'تحصيلي أحياء',
            children: [],
          },
        ],
      },
      {
        id: 3,
        name: 'موهبة',
        children: [
          {
            id: 13,
            name: 'كنجارو',
            children: [],
          },
          {
            id: 14,
            name: 'موهوب',
            children: [],
          },
          {
            id: 15,
            name: 'البرنامج الوطني للكشف عن الموهوبين',
            children: [],
          },
          {
            id: 16,
            name: 'أولمبياد الرياضيات',
            children: [],
          },
        ],
      },
      {
        id: 4,
        name: 'القدارت بالإنجليزية',
        children: [
          {
            id: 11,
            name: 'Verbal',
            children: [],
          },
          {
            id: 12,
            name: 'Quantitative',
            children: [],
          },
        ],
      },
    ];
  }

  showButton: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 10;
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    this.showButton = scrollPosition > 100;
  }
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
