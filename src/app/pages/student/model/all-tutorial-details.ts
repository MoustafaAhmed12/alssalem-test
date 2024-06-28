export interface TutorialDetails {
  id: number;
  name: string;
  description: string;
  img: string;
  weeks: number;
  categoryName: string;
  parentCategoryName: string;
  studentsNumbers: number;
  teacherName: string;
  priceBeforeDiscount: number;
  price: number;
  totalExamsNumber: number;
  totalVideoNumber: number;
  startDate: string;
  endDate: string;
  isOpen: boolean;
  units: Unit[];
  exams: Exam[];
  comments: Comment[];
}

export interface Unit {
  id: number;
  name: string;
  details: Detail[];
  isOpen: boolean;
}

export interface Detail {
  id: number;
  name: string;
  video: Video;
  exam: Exam;
  isCompleted: boolean;
  isOpen: boolean;
}

export interface Video {
  id: number;
  name: string;
}

export interface Attachment {
  id: number;
  name: string;
  link: any;
}

export interface Exam {
  id: number;
  examName: string;
}

export interface Comment {
  id: number;
  comment: string;
  createdAt: string;
  userName: string;
}
