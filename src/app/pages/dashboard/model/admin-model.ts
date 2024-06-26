export interface SystemUser {
  id: number;
  name: string;
  email: string;
  mobileNumber: string;
  roleName: string;
  action: string;
}

export interface GetUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  isLocked?: boolean;
  roleId: number;
  schoolId?: number;
}
export interface ID_Name {
  id: number;
  name: string;
}

export interface PaymentInfo {
  studentName: string;
  schoolName: string;
  paymentDate: string;
  educationalLevel: string;
  amount: number;
  discount: number;
  totalAmount: number;
}
export interface CategoryInfo {
  id: number;
  name: string;
  isVisibleToFront: boolean;
}

export interface Tutorial {
  id: number;
  name: string;
  price: number;
  priceBeforeDiscount: number;
  durationInWeeks: number;
  fakeStudentsEnrolled: number;
  description: string;
  img: string;
  categoryId: number;
  teacherId: number;
  isEnabled: boolean;
  isBuyAgain: boolean;
  questionTypeIds: number[];
}

export interface Comment {
  id: number;
  comment: string;
  studentName: string;
  tutorialName: string;
}
