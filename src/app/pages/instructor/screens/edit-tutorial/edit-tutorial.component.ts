import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormArray,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TeacherService } from '../../services/teacher.service';
import { CommonModule } from '@angular/common';
import { TitleScreenComponent } from '../../../../shared/components/title-screen/title-screen.component';
import { SafeUrlPipe } from '../../../../shared/Pipes/safe-url.pipe';
import {
  Attachment,
  Detail,
  Exam,
  TutorialAllInfo,
  Unit,
} from '../../../../shared/shared-model/tutorial-all-info';
import { NgSelectModule } from '@ng-select/ng-select';
import { AttachmentsService } from '../../services/attachments.service';
import {
  Form,
  FormExams,
  FormUnit,
  FormUnitContent,
} from '../../model/form-edit-tutorial';
import { ID_Name } from '../../../dashboard/model/admin-model';
@Component({
  selector: 'app-edit-tutorial',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TitleScreenComponent,
    SafeUrlPipe,
    NgSelectModule,
  ],
  templateUrl: './edit-tutorial.component.html',
  styleUrl: './edit-tutorial.component.scss',
})
export class EditTutorialComponent implements OnInit {
  fb = inject(NonNullableFormBuilder);
  teacherService = inject(TeacherService);
  attachmentsService = inject(AttachmentsService);
  toastr = inject(ToastrService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  tutorialDetails: any;
  tutorialId: number = 0;
  totalUnits: number = 1;
  submitted: boolean = false;
  tutorialForm!: Form;

  examsTutorials: ID_Name[] = [];
  attachmentsTutorial: ID_Name[] = [];
  attachmentsChapter: ID_Name[] = [];
  allVideos: ID_Name[] = [];
  allAttachment: Attachment[] = [];

  unitId = signal<number>(0);
  isLoading = signal<boolean>(false);

  ngOnInit() {
    this.route.queryParams.subscribe((query) => {
      this.unitId.set(parseInt(query['lenUnits']));
    });
    this.route.params.subscribe((params) => {
      this.tutorialId = parseInt(params['id']);
      this.fetchTeacherTutorialsExams({ tutorialId: this.tutorialId });
      this.fetchTeacherTutorialDetails({ tutorialId: this.tutorialId });
      this.fetchTutorialAttachments();
      this.fetchChaptersAttachments();
      this.fetchVideosDropdown();
    });
    this.tutorialForm = this.fb.group({
      id: [''],
      name: [''],
      attachments: [''],
      exams: this.fb.array<FormExams>([]),
      units:
        this.unitId() === 0
          ? this.fb.array<FormUnit>([this.generateUnit()])
          : this.fb.array<FormUnit>([]),
    });
  }

  // units
  get getUnits() {
    return this.tutorialForm.get('units') as FormArray;
  }

  generateUnit(): FormUnit {
    return this.fb.group({
      id: [0],
      name: ['', [Validators.required]],
      sortNumber: ['', [Validators.required]],
      unitExams: ['', [Validators.required]],
      detailsRequests: this.fb.array<FormUnitContent>([
        this.generateUnitContent(),
      ]),
      isDeleted: [false],
    });
  }

  addUnit(): void {
    this.getUnits.push(this.generateUnit());
    this.totalUnits = this.getUnits.value.length;
  }

  removeUnit(unitIndex: number): void {
    this.getUnits.at(unitIndex).get('isDeleted')?.setValue(true);
    const totalFilter = this.getUnits.controls.filter(
      (q) => !q.get('isDeleted')?.value
    ).length;
    this.totalUnits = totalFilter;
  }

  generateUnitContent(): FormUnitContent {
    return this.fb.group({
      id: [0],
      name: [''],
      videoUrl: [''],
      videoId: [null],
      examId: [null, [Validators.required]],
      chapterAttachmentId: [null],
      isDeleted: [false],
    });
  }

  addUnitContent(unitIndex: number): void {
    this.tutorialForm.controls.units
      .at(unitIndex)
      ?.controls?.detailsRequests.push(this.generateUnitContent());
  }

  removeUnitContent(unitIndex: number, contentIndex: number): void {
    this.tutorialForm.controls.units
      .at(unitIndex)
      ?.controls?.detailsRequests.at(contentIndex)
      .get('isDeleted')
      ?.setValue(true);
  }

  /// Exams
  get getExams() {
    return this.tutorialForm.get('exams') as FormArray;
  }

  generateExam(item: any): FormExams {
    return this.fb.group({
      id: [0],
      examId: [item.id],
      examName: [item.name],
      isDeleted: [false],
    });
  }

  addExam(item: any): void {
    for (let i = 0; i < this.getExams.value.length; i++) {
      const element = this.getExams.value[i];
      if (element.examId === item.id) {
        this.toastr.info('تم إختياره من قبل');
        return;
      }
    }
    console.log(item);
    this.getExams.push(this.generateExam(item));
  }

  removeExam(examIndex: number): void {
    this.getExams.controls[examIndex].get('isDeleted')?.setValue(true);
  }

  onItemSelect(item: any) {
    this.addExam(item);
  }
  //////////////////////////////////////////

  onSelectVideo(item: any, unitIndex: number, contentIndex: number): void {
    if (item !== undefined) {
      this.tutorialForm.controls.units
        .at(unitIndex)
        ?.controls?.detailsRequests?.at(contentIndex)
        .get('videoUrl')
        ?.disable();
    } else {
      this.tutorialForm.controls.units
        .at(unitIndex)
        ?.controls?.detailsRequests?.at(contentIndex)
        .get('videoUrl')
        ?.enable();
    }
  }

  //////////////////////////

  fetchTeacherTutorialDetails(tutorialId: { tutorialId: number }): void {
    this.isLoading.set(true);
    this.teacherService.getTeacherTutorialDetails(tutorialId).subscribe({
      next: ({ result, statusCode, msg }) => {
        if (statusCode === 200) {
          this.tutorialDetails = result as TutorialAllInfo;

          const tutorial = result as TutorialAllInfo;
          this.tutorialForm.patchValue({
            id: tutorial.id,
            name: tutorial.name,
            attachments: tutorial.attachments.map((item) => item.id),
          });
          tutorial.attachments.forEach((attachment) => {
            this.allAttachment.push(attachment);
          });

          // exams
          tutorial.exams.forEach((exam: Exam) => {
            this.getExams.push(
              this.fb.group({
                id: [exam.id],
                examName: [exam.examName],
                examId: [exam.examId],
                isDeleted: [exam.isDeleted],
              })
            );
          });

          tutorial.units.forEach((unit: Unit) => {
            const details = unit.details.map((detail: Detail) => {
              return this.fb.group({
                id: [detail.id],
                name: [detail.name],
                videoUrl: [
                  { value: detail.videoUrl, disabled: !!detail.videoId },
                ],
                videoId: [detail.videoId],
                examId: [detail.examId],
                isDeleted: [detail.isDeleted],
                chapterAttachmentId: [detail.chapterAttachmentId],
              });
            });

            this.getUnits.push(
              this.fb.group({
                id: [unit.id],
                name: [unit.name],
                sortNumber: [unit.sortNumber],
                isDeleted: [unit.isDeleted],
                unitExams: [unit.unitExams],
                detailsRequests: this.fb.array(details),
              })
            );
          });
          this.isLoading.update((v) => (v = false));
        } else {
          this.toastr.error(msg);
          this.isLoading.update((v) => (v = false));
        }
      },
      error: (err) => {
        this.isLoading.update((v) => (v = false));
        console.log(err);
      },
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.tutorialForm.controls['id'].setValue(this.tutorialDetails.id);
    this.tutorialForm.controls['name'].setValue(this.tutorialDetails.name);
    if (this.tutorialForm.invalid) {
      this.toastr.error('تأكد ان جيمع البيانات مُدخلة');
      return;
    }
    this.isLoading.set(true);

    this.teacherService
      .saveTeacherTutorialDetails(this.tutorialForm.value)
      .subscribe({
        next: ({ statusCode, msg }) => {
          if (statusCode === 200) {
            this.toastr.success(msg);
            this.isLoading.update((v) => (v = false));
            this.router.navigateByUrl('/instructor/tutorial');
          } else {
            this.toastr.error(msg);
            this.isLoading.update((v) => (v = false));
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoading.update((v) => (v = false));
        },
      });
  }

  // all exams
  fetchTeacherTutorialsExams(teacherId: any): void {
    this.teacherService.getTeacherTutorialsExams(teacherId).subscribe({
      next: ({ result, statusCode }) => {
        if (statusCode === 200) {
          this.examsTutorials = result;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // all Attachments for tutorials
  fetchTutorialAttachments(): void {
    this.attachmentsService.getTutorialAttachments().subscribe({
      next: ({ result, statusCode }) => {
        if (statusCode === 200) {
          this.attachmentsTutorial = result;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  // all Attachments for unist
  fetchChaptersAttachments(): void {
    this.attachmentsService.getChaptersAttachments().subscribe({
      next: ({ result, statusCode }) => {
        if (statusCode === 200) {
          this.attachmentsChapter = result;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  fetchVideosDropdown(): void {
    this.teacherService.getVideosDropdown().subscribe({
      next: ({ result, statusCode }) => {
        if (statusCode === 200) {
          this.allVideos = result;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
