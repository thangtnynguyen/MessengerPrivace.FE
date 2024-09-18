import { AbstractControl, ValidationErrors } from '@angular/forms';

export function phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
  const phoneNumber = control.value;

  // Regular expression to validate phone number format (example for US phone numbers)
  const phoneNumberPattern = /^\+?\d{10,15}$/; // Adjust the pattern to fit your requirements

  if (phoneNumber && !phoneNumberPattern.test(phoneNumber)) {
    return { invalidPhoneNumber: true };
  }

  return null;
}


export function emailValidator(control: AbstractControl): ValidationErrors | null {
  const email = control.value;

  // Regular expression để kiểm tra định dạng email
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (email && !emailPattern.test(email)) {
    return { invalidEmail: true };
  }

  return null;
}

