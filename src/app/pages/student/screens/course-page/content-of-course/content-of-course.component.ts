import { Location, NgClass } from '@angular/common';
import { Component, Input, OnInit, inject, signal } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import { Unit } from '../../../model/all-tutorial-details';

@Component({
  selector: 'app-content-of-course',
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive, RouterModule],
  templateUrl: './content-of-course.component.html',
  styleUrl: './content-of-course.component.scss',
})
export class ContentOfCourseComponent implements OnInit {
  @Input() unit!: Unit;
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
    const idExists = this.unit.details.some((d) => d.id === this.chapterId);
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
