import { Component, inject } from '@angular/core';
import { SideBarComponent } from '../../components/side-bar/side-bar.component';
import { SecondNavbarComponent } from '../../components/second-navbar/second-navbar.component';
import { TutorialService } from '../../services/tutorial.service';
import { TitleScreenComponent } from '../../../../shared/components/title-screen/title-screen.component';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [SideBarComponent, SecondNavbarComponent, TitleScreenComponent],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss',
})
export class AdminHomeComponent {
  tutorials = inject(TutorialService);
  lenOfTutorials = this.tutorials.numOfTutorials();
  lenOfTutorialsWork = this.tutorials.numOfTutorialsWork();
}
