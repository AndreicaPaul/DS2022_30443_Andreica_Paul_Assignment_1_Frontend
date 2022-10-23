import { FormGroup } from '@angular/forms';

export function passwordMatchValidator(
  confirmationPassword: string,
  password: string
) {
  return (formGroup: FormGroup) => {
    const confirmPasswordControl = formGroup.get(confirmationPassword);
    const passwordControl = formGroup.get(password);
    if (passwordControl.value !== confirmPasswordControl.value) {
      return confirmPasswordControl.setErrors({ matching: true });
    }
    if (
      confirmPasswordControl.errors &&
      confirmPasswordControl.errors['matching']
    ) {
      delete confirmPasswordControl.errors['matching'];
      confirmPasswordControl.updateValueAndValidity();
    }
  };
}
