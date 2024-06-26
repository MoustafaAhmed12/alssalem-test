import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type FormExams = FormGroup<{
  id: FormControl;
  examId: FormControl;
  examName: FormControl;
  isDeleted: FormControl;
}>;
///////////////////////
export type FormUnitContent = FormGroup<{
  id: FormControl;
  name: FormControl;
  videoUrl: FormControl;
  videoId: FormControl;
  examId: FormControl;
  isDeleted: FormControl;
  chapterAttachmentId: FormControl;
}>;

export type FormUnit = FormGroup<{
  id: FormControl;
  name: FormControl;
  sortNumber: FormControl;
  isDeleted: FormControl;
  unitExams: FormControl;
  detailsRequests: FormArray<FormUnitContent>;
  // unitExams: FormControl;
}>;
//////////////////////
export type Form = FormGroup<{
  id: FormControl;
  name: FormControl;
  attachments: FormControl;
  exams: FormArray<FormExams>;
  units: FormArray<FormUnit>;
}>;
