import { Component, Input, OnInit, inject } from '@angular/core';
import { AddCommentComponent } from './add-comment/add-comment.component';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../../../../authentication/services/auth.service';

type Comment = {
  id: number;
  comment: string;
  createdAt: string;
  userName: string;
};

@Component({
  selector: 'app-comments-student',
  standalone: true,
  imports: [AddCommentComponent, DatePipe],
  templateUrl: './comments-student.component.html',
  styleUrl: './comments-student.component.scss',
})
export class CommentsStudentComponent implements OnInit {
  @Input() comments: Comment[] = [];
  authService = inject(AuthService);
  isAuth: boolean = false;

  ngOnInit() {
    this.isAuth = this.authService.isAuth();
  }
}
