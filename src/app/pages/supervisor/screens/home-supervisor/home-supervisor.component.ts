import { NgClass } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../../authentication/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { SuperNavbarComponent } from '../../../parent/components/super-navbar/super-navbar.component';
import { CardStudentComponent } from '../../../parent/components/card-student/card-student.component';
import { SupervisorService } from '../../services/supervisor.service';

@Component({
  selector: 'app-home-supervisor',
  standalone: true,
  imports: [SuperNavbarComponent, CardStudentComponent],
  templateUrl: './home-supervisor.component.html',
  styleUrl: './home-supervisor.component.scss',
})
export class HomeSupervisorComponent implements OnInit {
  authService = inject(AuthService);
  supervisorService = inject(SupervisorService);
  toastr = inject(ToastrService);
  studentsSupervisor: any;
  studentsTutorials: any;
  currentUser: any;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser().userDto;
    this.fetchAllParentStudents({ userId: this.currentUser.id });
  }

  fetchAllParentStudents(supervisorId: any): void {
    this.isLoading = true;
    this.supervisorService.getSchoolStudents(supervisorId).subscribe({
      next: ({ statusCode, result, msg }) => {
        if (statusCode === 200) {
          this.studentsSupervisor = result;
          console.log(this.studentsSupervisor);
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
