import { Component, Input, OnInit, inject } from '@angular/core';
import { ParentService } from '../../services/parent.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-card-student',
  standalone: true,
  imports: [],
  templateUrl: './card-student.component.html',
  styleUrl: './card-student.component.scss',
})
export class CardStudentComponent implements OnInit {
  @Input() studentDetails: any;

  parentService = inject(ParentService);
  toastr = inject(ToastrService);
  studentsTutorials: any;

  ngOnInit() {
    this.fetchStudentsTutorials(this.studentDetails.id);
  }

  fetchStudentsTutorials(studentId: any): void {
    this.parentService.getStudentsTutorials(studentId).subscribe({
      next: ({ statusCode, result, msg }) => {
        if (statusCode === 200) {
          this.studentsTutorials = result;
        } else {
          this.toastr.error(msg);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
