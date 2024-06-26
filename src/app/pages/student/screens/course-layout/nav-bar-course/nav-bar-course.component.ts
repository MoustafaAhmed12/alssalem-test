import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar-course',
  standalone: true,
  imports: [],
  templateUrl: './nav-bar-course.component.html',
  styleUrl: './nav-bar-course.component.scss',
})
export class NavBarCourseComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  cateogryId: number = 0;
  tutorialId: number = 0;
  ngOnInit() {
    const params = this.route.snapshot.params;
    this.cateogryId = parseInt(params['cateogryId']) ?? null;
    this.tutorialId = parseInt(params['tutorialId']) ?? null;
  }

  toTurorial(): void {
    this.router.navigate([
      `cateogry-tutorials/${this.cateogryId}/tutorial/${this.tutorialId}`,
    ]);
  }
}
