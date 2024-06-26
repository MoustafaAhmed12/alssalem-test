import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../../authentication/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { SuperNavbarComponent } from '../../../parent/components/super-navbar/super-navbar.component';
import { CardStudentComponent } from '../../../parent/components/card-student/card-student.component';
import { AttachParentToStudentComponent } from '../../components/attach-parent-to-student/attach-parent-to-student.component';
import { ParentService } from '../../services/parent.service';

@Component({
  selector: 'app-home-parent',
  standalone: true,
  imports: [
    SuperNavbarComponent,
    CardStudentComponent,
    AttachParentToStudentComponent,
  ],
  templateUrl: './home-parent.component.html',
  styleUrl: './home-parent.component.scss',
})
export class HomeParentComponent implements OnInit {
  authService = inject(AuthService);
  parentService = inject(ParentService);
  toastr = inject(ToastrService);
  studentsParent: any;
  studentsTutorials: any;
  currentUser: any;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser().userDto;
    this.fetchAllParentStudents({ parentId: this.currentUser.id });
  }

  fetchAllParentStudents(parentId: any): void {
    this.isLoading = true;
    this.parentService.getAllParentStudents(parentId).subscribe({
      next: ({ statusCode, result, msg }) => {
        if (statusCode === 200) {
          this.studentsParent = result;
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.toastr.error(msg);
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }
}
