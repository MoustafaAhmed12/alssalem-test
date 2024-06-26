import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { confirmPasswordValidator } from '../../../shared/utils/confirmPasswordValidator';
import { environment } from '../../../../environments/environment';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEnvelope,
  faLock,
  faLockOpen,
  faPhone,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-parent-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgClass,
    RouterLink,
    FontAwesomeModule,
  ],
  templateUrl: './parent-register.component.html',
  styleUrl: './parent-register.component.scss',
})
export class ParentRegisterComponent implements OnInit {
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  fb = inject(FormBuilder);
  router = inject(Router);
  parentForm!: FormGroup;
  submitted = false;
  isLoading: boolean = false;

  logo: string = environment.logo;
  mainColorBg: string = environment.mainColorBg;
  mainColorText: string = environment.mainColorText;
  secondaryColorBgHover: string = environment.secondaryColorBgHover;
  secondaryColorTextHover: string = environment.secondaryColorTextHover;

  userIcon = faUser;
  emailIcon = faEnvelope;
  phoneIcon = faPhone;
  eyeIcon = faLock;
  eyeSlashIcon = faLockOpen;

  passwordFieldType: string = 'password';
  password: string = '';

  ngOnInit(): void {
    this.parentForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: [''],

        code: ['parent'],
      },
      { validator: confirmPasswordValidator }
    );
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onRegister() {
    this.submitted = true;
    if (this.parentForm.invalid) {
      this.toastr.error('تأكد من إدخال البيانات');

      return;
    }
    const formData = { ...this.parentForm.value };
    delete formData.confirmPassword;
    this.isLoading = true;
    this.authService.registerParent(formData).subscribe({
      next: ({ statusCode, msg }) => {
        if (statusCode === 200) {
          this.toastr.success(msg);
          this.isLoading = false;
          this.router.navigateByUrl('/login');
        } else {
          this.toastr.error(msg);
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
        this.toastr.error(err);
      },
    });
  }
}
