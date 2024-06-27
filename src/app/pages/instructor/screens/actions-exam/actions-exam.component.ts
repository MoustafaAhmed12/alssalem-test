import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  FormArray,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ID_Name } from '../../../dashboard/model/admin-model';
import { TeacherService } from '../../services/exams.service';
import { TutorialService } from '../../../dashboard/services/tutorial.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../authentication/services/auth.service';
import { ExamInfo, Form, FormAnswer, FormQuestion } from '../../model/teacher';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-actions-exam',
  standalone: true,
  templateUrl: './actions-exam.component.html',
  styleUrl: './actions-exam.component.scss',
  imports: [ReactiveFormsModule, CommonModule, NgSelectModule],
})
export class ActionsExamComponent implements OnInit {
  fb = inject(NonNullableFormBuilder);
  teacherService = inject(TeacherService);
  tutorialService = inject(TutorialService);
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  currentUser: any;
  examForm!: Form;
  examsTutorials: ID_Name[] = [];
  allQuestionTypes: ID_Name[] = [];

  examId: number = 0;
  questionId: number = 0;
  answerId: number = 0;

  isLoading: boolean = false;
  submitted: boolean = false;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.examId = parseInt(params['id']);

      if (this.examId > 0) {
        this.fetchExam({ examId: this.examId });
      }
    });

    this.examForm = this.fb.group({
      id: [this.examId === 0 ? 0 : this.examId],
      name: ['', [Validators.required]],
      passingPrecent: ['', [Validators.required]],
      durationInMinutes: ['', [Validators.required]],
      tutorialId: [null, [Validators.required]],
      totalGrades: [1],
      questions:
        this.examId === 0
          ? this.fb.array<FormQuestion>([this.generateQuestion()])
          : this.fb.array<FormQuestion>([]),
    });

    this.currentUser = this.authService.currentUser().userDto;

    this.fetchAllExamsTutorials({ teacherId: this.currentUser.id });
  }

  generateQuestion(): FormQuestion {
    return this.fb.group({
      id: [this.questionId === 0 ? 0 : this.questionId],
      questionImage: ['', [Validators.required]],
      questionTypeId: [null, [Validators.required]],
      isDeleted: [false],
      answers: this.fb.array<FormAnswer>(
        [
          this.generateAnswers('أ'),
          this.generateAnswers('ب'),
          this.generateAnswers('ج'),
          this.generateAnswers('د'),
        ],
        [Validators.required]
      ),
    });
  }

  generateAnswers(name: string): FormAnswer {
    return this.fb.group({
      id: [this.answerId === 0 ? 0 : this.answerId],
      name: [name, [Validators.required]],
      isRight: [false],
    });
  }

  addQuestion(): void {
    this.getQuestions.push(this.generateQuestion());
    const totalFilter = this.getQuestions.controls.filter(
      (q) => !q.get('isDeleted')?.value
    ).length;
    this.examForm.controls['totalGrades'].setValue(totalFilter);
  }

  get getQuestions() {
    return this.examForm.get('questions') as FormArray;
  }

  removeQuestion(questionIndex: number): void {
    this.getQuestions.at(questionIndex).get('isDeleted')?.setValue(true);
    const totalFilter = this.getQuestions.controls.filter(
      (q) => !q.get('isDeleted')?.value
    ).length;
    this.examForm.controls['totalGrades'].setValue(totalFilter);
  }

  onAnswerChange(questionIndex: number) {
    const answers = this.getQuestions
      .at(questionIndex)
      .get('answers') as FormArray;
    const selected = answers.controls.filter(
      (control) => control.get('isRight')?.value
    );
    if (selected.length > 1) {
      selected.forEach((control, index) => {
        control.get('isRight')?.setValue(false, { emitEvent: false });
      });
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.examForm.invalid) {
      this.toastr.error('تأكد ان جيمع البيانات مُدخلة');
      return;
    }
    if (this.examForm.get('durationInMinutes')?.value < 0) {
      this.toastr.error('تأكد ان وقت الاختبار اكبر من صفر');
      return;
    }
    this.examForm.value.questions?.forEach((q, index) => {
      const isBasw64Bit = this.isBase64Image(q.questionImage);
      if (isBasw64Bit) {
        this.getQuestions.controls[index]
          .get('questionImage')
          ?.setValue(q.questionImage);
      } else {
        this.getQuestions.controls[index].get('questionImage')?.setValue(null);
      }
    });
    this.isLoading = true;
    this.teacherService.SaveExam(this.examForm.value).subscribe({
      next: ({ statusCode, msg }) => {
        if (statusCode === 200) {
          this.toastr.success(msg);
          this.isLoading = false;
          this.router.navigateByUrl('/instructor/exams');
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

  fetchExam(examId: any): void {
    this.isLoading = true;
    this.teacherService.getExamById(examId).subscribe({
      next: ({ statusCode, result, msg }) => {
        if (statusCode == 200) {
          let exam = result as ExamInfo;
          const questions = this.examForm.get('questions') as FormArray;

          this.isLoading = false;
          this.examForm.patchValue({
            id: exam.id,
            name: exam.name,
            tutorialId: exam.tutorialId,
            durationInMinutes: exam.durationInMinutes,
            totalGrades: exam.totalGrades,
          });
          exam.questions.forEach((question: any) => {
            const answers = question.answers.map((answer: any) => {
              return this.fb.group({
                id: [answer.id],
                name: [answer.name, [Validators.required]],
                isRight: [answer.isRight],
              });
            });

            questions.push(
              this.fb.group({
                id: [question.id],
                questionImage: [question.questionImage],
                questionTypeId: [
                  question.questionTypeId,
                  [Validators.required],
                ],
                isDeleted: [question.isDeleted],
                answers: this.fb.array(answers),
              })
            );
          });
        } else {
          this.toastr.error(msg);
          this.isLoading = false;
        }
      },
    });
  }
  onSeletedTutorial(item: any): void {
    console.log(item);
    this.fetchAllQuestionTypes({ tutorialId: item.id });
    console.log(this.allQuestionTypes);
  }

  fetchAllExamsTutorials(teacherId: any): void {
    this.teacherService.getExamsTutorials(teacherId).subscribe({
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

  // QuestionTypes
  fetchAllQuestionTypes(tutorialId: { tutorialId: number }): void {
    this.tutorialService.getTutorialQuestionTypes(tutorialId).subscribe({
      next: ({ result, statusCode }) => {
        if (statusCode === 200) {
          this.allQuestionTypes = result;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onPaste(event: ClipboardEvent, questionIndex: number): void {
    const items = event.clipboardData?.items;
    if (items) {
      // Convert DataTransferItemList to an array
      const itemsArray = Array.from(items);

      for (const item of itemsArray) {
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            this.convertToBase64(file).then((base64Image: string) => {
              this.getQuestions
                .at(questionIndex)
                .get('questionImage')
                ?.setValue(base64Image);
            });
          }
        }
      }
    }
  }

  onFileDrop(event: DragEvent, questionIndex: number): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.convertToBase64(files[0]).then((base64Image: string) => {
        this.getQuestions
          .at(questionIndex)
          .get('questionImage')
          ?.setValue(base64Image);
      });
    }
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  isBase64Image(str: string): boolean {
    const base64Pattern = /^data:image\/(png|jpeg|jpg);base64,/;
    return base64Pattern.test(str);
  }
}
