import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-with-google',
  standalone: true,
  imports: [],
  templateUrl: './sign-with-google.component.html',
  styleUrl: './sign-with-google.component.scss',
})
export class SignWithGoogleComponent {
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  router = inject(Router);

  loginWithGoogle() {
    console.log('sss');
    debugger;
    this.authService.studentGoogleLogin().subscribe({
      next: ({ statusCode, result, msg }) => {
        if (statusCode === 200) {
          const roleDto = result.roleDto;
          if (roleDto.roleName === 'طالب') {
            this.router.navigateByUrl('/');
          }

          this.authService.setIsAuth(true);
          this.toastr.success(msg);
        } else {
          this.authService.setIsAuth(false);
          this.toastr.error(msg);
        }
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.msg, 'عفواً');
      },
    });
  }
}
