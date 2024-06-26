import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormatTimePipe } from '../../../../../shared/Pipes/format-time.pipe';
import { TutorilsStudentsService } from '../../../services/tutorils-students.service';
import { AuthService } from '../../../../../authentication/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CdTimerComponent, CdTimerModule } from 'angular-cd-timer';
import { Subscription, interval } from 'rxjs';
import { CorrectionExamComponent } from './correction-exam/correction-exam.component';
import { CorrectionExamService } from '../../../services/correction-exam.service';

export type Form = FormGroup<{
  id: FormControl;
  userId: FormControl;
  examId: FormControl;
  durationInMinutes: FormControl;
  questions: FormArray<FormQuestion>;
}>;
type FormQuestion = FormGroup<{
  id: FormControl;
  questionTypeId: FormControl;
  answers: FormArray<FormAnswer>;
}>;

type FormAnswer = FormGroup<{
  id: FormControl;
  name: FormControl;
  isRight: FormControl;
}>;

@Component({
  selector: 'app-test-lesson',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormatTimePipe,
    CdTimerModule,
    CorrectionExamComponent,
  ],
  templateUrl: './test-lesson.component.html',
  styleUrl: './test-lesson.component.scss',
  animations: [
    trigger('tabAnimation', [
      state(
        'tab1',
        style({
          opacity: 1,
          transform: 'scale(1)',
        })
      ),
      state(
        'tab2',
        style({
          opacity: 1,
          transform: 'scale(1)',
        })
      ),
      state(
        'tab3',
        style({
          opacity: 1,
          transform: 'scale(1)',
        })
      ),
      transition('* => *', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('250ms ease-out'),
      ]),
    ]),
  ],
})
export class TestLessonComponent implements OnInit {
  tutorilsStudentsService = inject(TutorilsStudentsService);
  correctionExamService = inject(CorrectionExamService);
  fb = inject(NonNullableFormBuilder);
  correctionForm!: Form;
  cdr = inject(ChangeDetectorRef);
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  route = inject(ActivatedRoute);
  isAuth: boolean = false;
  currentUser: any;
  isLoading = signal<boolean>(false);
  correctionLoading = signal<boolean>(false);

  time: number = 0;

  examId: number = 0;
  examDetails: any;
  correctionExamDetails: any;

  currentPage: number = 0;
  questionsPerPage: number = 1;

  timeInMin: string = '';
  takeTime: number = 0;
  newTime = 0.1;
  timerSubscription!: Subscription;

  selectedTab: number = 0;

  @ViewChild('basicTimer', { static: false }) basicTimer!: CdTimerComponent;
  startTime: number = 0;
  isCountdown: boolean = false;

  ngOnInit(): void {
    this.isAuth = this.authService.isAuth();
    this.currentUser = this.authService.currentUser()?.userDto;
    this.route.params.subscribe((params) => {
      this.examId = parseInt(params['examId']);
      if (this.examId && this.isAuth === true) {
        this.fetchStudentExam({
          examId: this.examId,
          userId: this.currentUser.id,
        });
      }
      if (this.isAuth === false) {
        this.fetchStudentExam({
          examId: this.examId,
          userId: 0,
        });
      }
    });

    this.correctionForm = this.fb.group({
      id: [0],
      userId: [this.isAuth ? this.currentUser.id : 0],
      examId: [this.examId],
      durationInMinutes: [0],
      questions: this.fb.array<FormQuestion>([]),
    });
  }

  get getQuestions() {
    return this.correctionForm.get('questions') as FormArray;
  }

  onAnswerSelected(questionIndex: number, answerIndex: number) {
    const answers = this.getQuestions
      .at(questionIndex)
      .get('answers') as FormArray;
    answers.controls.forEach((answerControl, index) => {
      if (index === answerIndex) {
        answerControl.get('isRight')?.setValue(true); // Set selected answer to true
      } else {
        answerControl.get('isRight')?.setValue(false); // Set other answers to false
      }
    });
  }

  resetQuestions(): void {
    while (this.getQuestions.length !== 0) {
      this.getQuestions.removeAt(0);
    }
  }

  fetchStudentExam(examIdAndUserId: any): void {
    this.isLoading.set(true);
    this.tutorilsStudentsService.getStudentExam(examIdAndUserId).subscribe({
      next: ({ statusCode, result, msg }) => {
        if (statusCode === 200) {
          this.selectedTab = 0;
          this.resetQuestions();

          this.correctionForm.get('questions')?.reset();
          this.examDetails = result;
          this.time = this.examDetails.durationInMinutes;
          this.convertMinutesToTime(this.examDetails.durationInMinutes);
          console.log(this.getQuestions);
          result.questions.forEach((question: any) => {
            const answers = question.answers.map((answer: any) => {
              return this.fb.group({
                id: [answer.id],
                name: [answer.name],
                isRight: [answer.isRight],
              });
            });

            this.getQuestions.push(
              this.fb.group({
                id: [question.id],
                questionImage: [question.questionImage],
                isDeleted: [question.isDeleted],
                questionTypeId: [question.questionTypeId],
                answers: this.fb.array(answers),
              })
            );
          });

          this.isLoading.update((v) => (v = false));
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

  startTimer() {
    if (this.time === 0) {
      this.isCountdown = false;
      this.startTime = 0;

      this.basicTimer?.reset();
      this.basicTimer?.start();
    } else {
      this.isCountdown = true;
      this.startTime = this.time * 60;
      this.basicTimer?.reset();
      this.basicTimer?.start();
    }
  }

  onComplete() {
    this.toastr.info('تم إنتهاء الوقت المحدد');
    this.selectedTab = 2;
    this.cdr.detectChanges();
    this.onSubmit();
  }

  tabs = [
    { label: 'قبل الإختبار' },
    { label: 'أبدا الإختبار' },
    { label: 'إنهاء الإختبار' },
  ];

  selectTab(index: number) {
    this.selectedTab = index;
    if (index === 1) {
      this.startTimer();
    }
    if (index === 2) {
      this.onSubmit();
      this.getQuestions.reset();
    }
  }

  prepareDataForSubmission() {
    const formData = { ...this.correctionForm.value };
    formData.questions = formData.questions || [];
    formData.questions = formData.questions.map((question: any) => {
      const { isDeleted, questionImage, ...rest } = question;
      return rest;
    });

    return formData;
  }

  onSubmit(): void {
    if (this.time === 0) {
      this.takeTime = this.basicTimer?.get()?.tick_count;
    } else {
      const newTime = this.time * 60;
      this.takeTime = newTime - this.basicTimer?.get().tick_count;
    }
    this.correctionForm.get('durationInMinutes')?.setValue(this.takeTime);
    console.log(this.correctionForm.value);
    this.correctionLoading.set(true);
    this.correctionExamService
      .correctStudentExam(this.correctionForm.value)
      .subscribe({
        next: ({ statusCode, result, msg }) => {
          if (statusCode === 200) {
            this.toastr.success('تم تصحيح الامتحان بنجاح');
            this.correctionLoading.update((v) => (v = false));
            this.correctionExamDetails = result;
          } else {
            this.toastr.error(msg);
            this.correctionLoading.update((v) => (v = false));
          }
        },
        error: (err) => {
          console.log(err);
          this.correctionLoading.update((v) => (v = false));
        },
      });
  }

  convertMinutesToTime(minutes: number): void {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    this.timeInMin = `${this.padZero(hours)}:${this.padZero(mins)}:00`;
  }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  // Navigation

  nextQuestion(): void {
    if (this.currentPage < this.examDetails?.totalGrades) {
      this.currentPage++;
    }
  }

  prevQuestion(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.examDetails?.totalGrades / this.questionsPerPage);
  }

  getPageRange(): number[] {
    const rangeSize = 5; // Number of page numbers to display
    const start = Math.max(0, this.currentPage - Math.floor(rangeSize / 2));
    const end = Math.min(this.totalPages - 1, start + rangeSize - 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i + 1);
  }

  gotoPage(pageNum: number): void {
    if (pageNum >= 1 && pageNum <= this.totalPages) {
      this.currentPage = pageNum - 1;
    }
  }

  ////////////////////////////////////////////////////////////////////////////
}
