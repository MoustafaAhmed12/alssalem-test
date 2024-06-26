import { Component, OnInit, inject } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../../../authentication/services/auth.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnInit {
  authService = inject(AuthService);
  isAuth: boolean = false;
  mainColorText: string = environment.mainColorText;
  mainColorBgHover: string = environment.mainColorBgHover;
  secondaryColorBg: string = environment.secondaryColorBg;
  firstWord: string = environment.firstWord;
  desc: string = environment.desc;

  ngOnInit() {
    this.isAuth = this.authService.isAuth();
  }
}
