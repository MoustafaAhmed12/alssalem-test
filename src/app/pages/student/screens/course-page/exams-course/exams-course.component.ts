import { Location, NgClass } from '@angular/common';
import { Component, Input, OnInit, inject, signal } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';

@Component({
  selector: 'app-exams-course',
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive, RouterModule],
  templateUrl: './exams-course.component.html',
  styleUrl: './exams-course.component.scss',
})
export class ExamsCourseComponent implements OnInit {
  @Input() exams!: any;
  @Input() isOpened: boolean = false;
  route = inject(ActivatedRoute);
  router = inject(Router);
  location = inject(Location);
  isInContentPage: boolean = false;
  isOpen = signal<boolean>(false);
  cateogryId: number = 0;
  tutorialId: number = 0;
  chapterId: number = 0;
  idExists: boolean = false;

  ngOnInit() {
    const params = this.route.snapshot.params;
    this.cateogryId = parseInt(params['cateogryId']) ?? null;
    this.tutorialId = parseInt(params['tutorialId']) ?? null;
    const url = this.location.path();
    this.chapterId = this.getLastNumberFromString(url);
    this.isInContentPage = url.includes('lesson') || url.includes('exam');
    const idExists = this.exams.some((d: any) => d.id === this.chapterId);
    this.isOpen.set(idExists);
  }

  getLastNumberFromString(path: string): number {
    const parts = path.split('/');
    const numbers = parts.filter((part) => !isNaN(Number(part)));
    return (numbers.length = Number(numbers[numbers.length - 1]));
  }

  handleOpen(): void {
    this.isOpen.update((v) => (v = !this.isOpen()));
  }
}
