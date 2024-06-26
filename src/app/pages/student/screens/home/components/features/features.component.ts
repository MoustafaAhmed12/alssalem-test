import {
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnInit,
} from '@angular/core';
import { Swiper } from 'swiper';
import { environment } from '../../../../../../../environments/environment';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-features',
  standalone: true,
  imports: [NgClass],
  templateUrl: './features.component.html',
  styleUrl: './features.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FeaturesComponent implements AfterViewInit {
  mainColorBg: string = environment.mainColorBg;
  secondaryColorBg: string = environment.secondaryColorBg;

  ngAfterViewInit() {
    const swiperEl = document.querySelector('.mySwiper') as any;

    Object.assign(swiperEl, {
      slidesPerView: 1,
      spaceBetween: 10,
      breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 1,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 50,
        },
      },
    });

    swiperEl.initialize();
  }
}
