import { Component, OnInit, inject } from '@angular/core';
import { TutorilsStudentsService } from '../../../../services/tutorils-students.service';
import { Category } from '../../../../../../shared/components/navbar/navbar.component';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-important-cateogry',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './important-cateogry.component.html',
  styleUrl: './important-cateogry.component.scss',
})
export class ImportantCateogryComponent {
  imgs: any[] = [
    {
      id: 1,
      img: './../../../../../../../assets/imgs/c1.png',
      alt: 'important cateogry',
    },
    {
      id: 2,
      img: './../../../../../../../assets/imgs/c2.png',
      alt: 'important cateogry',
    },
    {
      id: 3,
      img: './../../../../../../../assets/imgs/c3.png',
      alt: 'important cateogry',
    },
    {
      id: 4,
      img: './../../../../../../../assets/imgs/c4.png',
      alt: 'important cateogry',
    },
  ];
}
