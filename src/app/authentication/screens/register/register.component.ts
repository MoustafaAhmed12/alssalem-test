import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { AuthService } from '../../services/auth.service';
import { confirmPasswordValidator } from '../../../shared/utils/confirmPasswordValidator';
import { SchoolService } from '../../../pages/dashboard/services/school.service';
import { ID_Name } from '../../../pages/dashboard/model/admin-model';
import { NgSelectModule } from '@ng-select/ng-select';
import { environment } from '../../../../environments/environment';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faEnvelope,
  faLock,
  faLockOpen,
  faKey,
  faUser,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NavbarComponent,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgClass,
    RouterLink,
    NgSelectModule,
    FontAwesomeModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  authService = inject(AuthService);
  schoolService = inject(SchoolService);
  fb = inject(FormBuilder);
  toastr = inject(ToastrService);
  router = inject(Router);
  allSchools: ID_Name[] = [];
  registerForm!: FormGroup;
  submitted = false;
  isLoading = signal<boolean>(false);

  classNumbers: any = [
    {
      id: 1,
      name: '1',
    },
    {
      id: 2,
      name: '2',
    },
    {
      id: 3,
      name: '3',
    },
    {
      id: 4,
      name: '4',
    },
    {
      id: 5,
      name: '5',
    },
    {
      id: 6,
      name: '6',
    },
    {
      id: 7,
      name: '7',
    },
    {
      id: 8,
      name: '8',
    },
    {
      id: 9,
      name: '9',
    },
    {
      id: 10,
      name: '10',
    },
  ];

  logo: string = environment.logo;
  mainColorBg: string = environment.mainColorBg;
  mainColorText: string = environment.mainColorText;
  secondaryColorBgHover: string = environment.secondaryColorBgHover;
  secondaryColorTextHover: string = environment.secondaryColorTextHover;

  userIcon = faUser;
  emailIcon = faEnvelope;
  kayIcon = faKey;
  eyeIcon = faLock;
  eyeSlashIcon = faLockOpen;
  phoneIcon = faPhone;

  passwordFieldType: string = 'password';
  password: string = '';

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: [''],
        phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],

        schoolId: [null, [Validators.required]],
        state: [null, [Validators.required]],
        roleCode: ['student'],
        classNumber: [null, [Validators.required]],
      },
      { validator: confirmPasswordValidator }
    );
    this.fetchAllSchools();
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onRegister() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      this.toastr.error('تأكد من إدخال البيانات');
      return;
    }
    const formData = { ...this.registerForm.value };
    delete formData.confirmPassword;
    this.isLoading.set(true);
    this.authService.createUser(formData).subscribe({
      next: ({ statusCode, msg }) => {
        if (statusCode === 200) {
          this.toastr.success(msg);
          this.isLoading.update((v) => (v = false));
          this.router.navigateByUrl('/login');
        } else {
          this.toastr.error(msg);
          this.isLoading.update((v) => (v = false));
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading.update((v) => (v = false));
        this.toastr.success(err);
      },
    });
  }

  // get All Schools
  fetchAllSchools(): void {
    this.schoolService.getSystemSchools().subscribe({
      next: ({ result, statusCode }) => {
        if (statusCode === 200) {
          this.allSchools = result;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
