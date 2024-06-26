import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Category } from '../navbar/navbar.component';

@Component({
  selector: 'app-navbar-item',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass, RouterModule],
  templateUrl: './navbar-item.component.html',
  styleUrl: './navbar-item.component.scss',
})
export class NavbarItemComponent {
  @Input() category!: Category;
  mainColorBgHover: string = environment.mainColorBgHover;
  secondaryColorBorder: string = environment.secondaryColorBorder;
  mainColorBg: string = environment.mainColorBg;
  secondaryColorBg: string = environment.secondaryColorBg;

  menu_show: boolean = false;
  menu_button() {
    this.menu_show = true;
  }
  menu_button_close() {
    this.menu_show = false;
  }
}
