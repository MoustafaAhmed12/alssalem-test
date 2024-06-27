import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-card.component.html',
  styleUrl: './course-card.component.scss',
})
export class CourseCardComponent implements OnInit {
  @Input() tutorial!: any;
  cateogryId: number | null = 0;

  router = inject(Router);
  route = inject(ActivatedRoute);

  ngOnInit() {
    const params = this.route.snapshot.params;
    this.cateogryId = parseInt(params['cateogryId']) ?? null;
  }

  goToTutorial(tutorialId: any): void {
    this.router.navigate([
      `cateogry-tutorials/${this.cateogryId}/tutorial/`,
      tutorialId,
    ]);
  }
}
