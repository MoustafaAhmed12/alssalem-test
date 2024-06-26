export interface Attachment {
  id: number;
  link: string;
  isDeleted: boolean;
}

export interface Exam {
  id: number;
  examName: string;
  examId: number;
  isDeleted: boolean;
}

export interface Detail {
  id: number;
  name: string;
  videoUrl: string;
  videoId: number;
  examId: number;
  isDeleted: boolean;
  chapterAttachmentId: number;
}

export interface Unit {
  id: number;
  name: string;
  sortNumber: number;
  isDeleted: boolean;
  details: Detail[];
  unitExams: number[];
}

export interface TutorialAllInfo {
  id: number;
  name: string;
  units: Unit[];
  exams: Exam[];
  attachments: Attachment[];
}
