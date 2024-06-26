import { AbstractControl, ValidatorFn } from '@angular/forms';

export function EmailOrPhoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phonePattern = /^[0-9]{9}$/;

    if (!value) {
      return null; // Return null if the value is empty
    }

    if (emailPattern.test(value) || phonePattern.test(value)) {
      return null; // Return null if the value matches either email or phone number format
    } else {
      return { invalidEmailOrPhoneNumber: true }; // Return error if the value doesn't match either format
    }
  };
}
