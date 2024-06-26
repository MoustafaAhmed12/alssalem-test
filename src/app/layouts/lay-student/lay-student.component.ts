import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { NavberServiceService } from '../../shared/services/navber-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lay-student',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './lay-student.component.html',
  styleUrl: './lay-student.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayStudentComponent implements OnDestroy, AfterViewInit {
  NavberService = inject(NavberServiceService);
  cdr = inject(ChangeDetectorRef);

  showNavbar: boolean = true;
  subscription!: Subscription;
  value: number = 1;
  constructor() {
    this.subscription = this.NavberService.showNavBar.subscribe((value) => {
      this.showNavbar = value;
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  ngAfterViewInit() {
    // Defer the change to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.value = -1; // Change the value
      this.cdr.detectChanges(); // Manually trigger change detection if needed
    });
  }
}
