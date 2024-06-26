import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-one-package',
  standalone: true,
  imports: [],
  templateUrl: './one-package.component.html',
  styleUrl: './one-package.component.scss',
})
export class OnePackageComponent {
  @Input() packageName: string = '';
  @Input() img: string = '';
}
