import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { EmailOrPhoneNumberValidator } from '../../../shared/utils/EmailOrPhoneNumberValidator';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faLock,
  faLockOpen,
  faKey,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../../environments/environment';
import { SignWithGoogleComponent } from '../sign-with-google/sign-with-google.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    RouterLink,
    FontAwesomeModule,
    SignWithGoogleComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  router = inject(Router);
  formBuilder = inject(FormBuilder);
  loginForm!: FormGroup;
  submitted = false;
  error: string = '';
  isLoading: boolean = false;

  userIcon = faUser;
  kayIcon = faKey;
  eyeIcon = faLock;
  eyeSlashIcon = faLockOpen;
  logo: string = environment.logo;
  mainColorBg: string = environment.mainColorBg;
  mainColorText: string = environment.mainColorText;
  secondaryColorBgHover: string = environment.secondaryColorBgHover;
  secondaryColorTextHover: string = environment.secondaryColorTextHover;

  passwordFieldType: string = 'password';
  password: string = '';

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email_phone: ['', [Validators.required, EmailOrPhoneNumberValidator()]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onLogin() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.toastr.error('تأكد من إدخال البيانات');
      return;
    }
    debugger;
    this.isLoading = true;
    this.authService.loginUser(this.loginForm.value).subscribe({
      next: ({ statusCode, result, msg }) => {
        if (statusCode === 200) {
          const roleDto = result.roleDto;
          if (roleDto.roleName === 'أدمن') {
            this.router.navigate(['/admin']);
          } else if (
            roleDto.roleName === 'مشرف مدرسة' ||
            roleDto.roleName === 'ولي أمر'
          ) {
            this.router.navigateByUrl('/supervisor');
          } else if (
            roleDto.roleName === 'مدرس' ||
            roleDto.roleName === 'مدخل بيانات'
          ) {
            this.router.navigateByUrl('/instructor');
          } else {
            this.router.navigateByUrl('/');
          }
          this.isLoading = false;
          this.authService.setIsAuth(true);
          this.toastr.success(msg);
        } else {
          this.isLoading = false;
          this.authService.setIsAuth(false);
          this.toastr.error(msg);
        }
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error.msg, 'عفواً');
        this.error = err.error.msg;
        this.isLoading = false;
      },
    });
  }
}
