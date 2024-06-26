import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../../authentication/services/auth.service';
import { AttachmentsService } from '../../../services/attachments.service';
import { TitleScreenComponent } from '../../../../../shared/components/title-screen/title-screen.component';

@Component({
  selector: 'app-add-attachments',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgSelectModule, TitleScreenComponent],
  templateUrl: './add-attachments.component.html',
  styleUrl: './add-attachments.component.scss',
})
export class AddAttachmentsComponent implements OnInit {
  @Output() fetchAttachment: EventEmitter<any> = new EventEmitter<any>();

  authService = inject(AuthService);
  attachmentsService = inject(AttachmentsService);
  toastr = inject(ToastrService);
  isLoading: boolean = false;
  submitted: boolean = false;
  currentUser: any;
  fb = inject(FormBuilder);
  uploadForm!: FormGroup;
  pdfsFile: File | null = null;
  pdfUrl!: string;

  attachmentId: number = 0;

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser().userDto;

    this.uploadForm = this.fb.group({
      file: ['', [Validators.required]],
      teacherId: [this.currentUser.id],
      name: ['', [Validators.required]],
      isTutorial: [null],
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.pdfsFile = input.files[0];
      this.uploadForm.patchValue({ file: this.pdfsFile });
    }
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.pdfsFile = files[0];
      this.uploadForm.patchValue({ file: this.pdfsFile });
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.uploadForm.invalid) {
      this.toastr.error('تأكد من إدخال البيانات ');
      return;
    }
    if (!this.pdfUrl) {
      this.toastr.info('جاري تحميل الملف...');
    }
    if (this.uploadForm.valid && this.pdfsFile) {
      const formData = new FormData();
      formData.append('pdfFile', this.uploadForm.get('file')?.value);
      formData.append('userId', this.uploadForm.get('teacherId')?.value);
      formData.append('name', this.uploadForm.get('name')?.value);
      formData.append('isTutorial', this.uploadForm.get('isTutorial')?.value);
      console.log(formData);
      this.isLoading = true;
      this.attachmentsService.UploadPdf(formData).subscribe({
        next: ({ statusCode, msg }) => {
          if (statusCode === 200) {
            this.fetchAttachment.emit({ userId: this.currentUser.id });
            // this.videoUrl = result;
            this.isLoading = false;
            this.toastr.success(msg);
          } else {
            this.isLoading = false;
            this.toastr.error(msg);
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
        },
      });
    }
  }
}
