import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { AuthService } from '../../../../../../authentication/services/auth.service';
import { TutorilsStudentsService } from '../../../../services/tutorils-students.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-add-comment',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './add-comment.component.html',
  styleUrl: './add-comment.component.scss',
})
export class AddCommentComponent implements OnInit {
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  tutorilsStudentsService = inject(TutorilsStudentsService);
  route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  commentForm!: FormGroup;
  userId: number = 0;
  tutorialId: number = 0;
  isLoading = signal<boolean>(false);
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.tutorialId = parseInt(params['tutorialId']);
    });

    this.userId = this.authService.currentUser().userDto.id;
    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.isLoading.set(true);
    const commentInfo = {
      comment: this.commentForm.get('comment')?.value,
      userId: this.userId,
      tutorialId: this.tutorialId,
    };
    console.log(commentInfo);
    this.tutorilsStudentsService.createTutorialComment(commentInfo).subscribe({
      next: ({ statusCode, msg }) => {
        if (statusCode === 200) {
          this.isLoading.update((v) => (v = false));
          this.toastr.success(msg);
          this.commentForm.get('comment')?.setValue('');
        } else {
          this.isLoading.update((v) => (v = false));
          this.toastr.error(msg);
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading.update((v) => (v = false));
      },
    });
  }
}
