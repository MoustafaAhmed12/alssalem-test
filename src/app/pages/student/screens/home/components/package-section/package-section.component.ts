import { Component } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-package-section',
  standalone: true,
  imports: [NgClass, RouterLink],
  templateUrl: './package-section.component.html',
  styleUrl: './package-section.component.scss',
})
export class PackageSectionComponent {
  secondaryColorBg: string = environment.secondaryColorBg;
  mainColorText: string = environment.mainColorText;
  mainColorBgHover: string = environment.mainColorBgHover;
}
