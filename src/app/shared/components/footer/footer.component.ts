import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [NgClass],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  secondaryColorBg: string = environment.secondaryColorBg;
  secondaryColorTextHover: string = environment.secondaryColorTextHover;
}
