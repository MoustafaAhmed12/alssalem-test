import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../../../../services/admin.service';
import { GetUser, ID_Name } from '../../../../model/admin-model';
import { ToastrService } from 'ngx-toastr';
import { SchoolService } from '../../../../services/school.service';
import { ApiCacheService } from '../../../../../../shared/services/api-cache.service';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-container-actions',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    RouterLink,
    NgSelectModule,
  ],
  templateUrl: './container-actions.component.html',
  styleUrl: './container-actions.component.scss',
})
export class ContainerActionsComponent implements OnInit {
  adminService = inject(AdminService);
  apiCacheService = inject(ApiCacheService);
  schoolService = inject(SchoolService);
  toastr = inject(ToastrService);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  userId: number = 0;
  allRoles: ID_Name[] = [];
  allSchools: ID_Name[] = [];

  formData!: FormGroup;
  submitted = false;
  isLoading: boolean = false;
  constructor() {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = parseInt(params['id']);
      if (this.userId > 0) {
        this.fetchUser({
          userId: this.userId,
        });
      }
    });

    this.formData = this.fb.group({
      id: [this.userId === 0 ? 0 : this.userId],
      firstName: [
        '',
        [
          Validators.required,
          Validators.pattern('^[\u0621-\u064A\u0660-\u0669.\\-_ًٍَُِ~ٌّْ ]+$'),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.pattern('^[\u0621-\u064A\u0660-\u0669.\\-_ًٍَُِ~ٌّْ ]+$'),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],

      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      role_ID: [null, [Validators.required]],
      school_ID: [
        {
          value: null,
          disabled: true,
        },
      ],
    });

    // all Roles
    this.fetchAllRoles();

    // all Schools
    this.fetchAllSchools();
  }

  selectionChangedForRole(event: any) {
    this.checkRole(event.id);
  }

  onSubmit() {
    this.submitted = true;
    if (this.formData.invalid) {
      return;
    }
    if (
      this.formData.value.role_ID === 2 ||
      this.formData.value.role_ID === 3 ||
      this.formData.value.role_ID === 4 ||
      this.formData.value.role_ID === 5
    ) {
      this.formData.value.school_ID = 0;
    }
    this.isLoading = true;

    this.adminService.SaveSystemUsers(this.formData.value).subscribe({
      next: ({ statusCode, msg }) => {
        if (statusCode === 200) {
          this.toastr.success(msg);
          this.isLoading = false;
          this.apiCacheService.clearCache();
          this.router.navigateByUrl('/admin/users');
        } else {
          this.toastr.error(msg);
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  fetchUser(userId: { userId: number }): void {
    this.isLoading = true;
    this.adminService.getUserById(userId).subscribe({
      next: ({ statusCode, result, msg }) => {
        if (statusCode == 200) {
          const user = result as GetUser;
          console.log(user);
          this.isLoading = false;
          this.formData.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            phone: user.phone,
            role_ID: user.roleId,
            school_ID: user.schoolId,
          });
          this.checkRole(user.roleId);
        } else {
          this.toastr.error(msg);
          this.isLoading = false;
        }
      },
    });
  }

  // get All Roles
  fetchAllRoles(): void {
    this.adminService.getSystemRoles().subscribe({
      next: ({ result, statusCode }) => {
        if (statusCode === 200) {
          this.allRoles = result;
        }
      },
      error: (err) => {
        console.log(err);
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

  checkRole(roleId: number): void {
    if (roleId == 6) {
      this.formData.get('school_ID')?.enable();
    } else {
      this.formData.get('school_ID')?.disable();
    }
  }
}
