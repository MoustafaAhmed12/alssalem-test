import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'app-opinions',
  standalone: true,
  imports: [],
  templateUrl: './opinions.component.html',
  styleUrl: './opinions.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OpinionsComponent {
  mainColorBg: string = environment.mainColorBg;
}
