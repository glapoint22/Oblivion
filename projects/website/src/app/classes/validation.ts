import { Directive } from "@angular/core";
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Modal } from "./modal";

@Directive()
export class Validation extends Modal {
  public form!: FormGroup;
  

  getErrorMessages(control: string, controlName: string): Array<string> {
    let messages: Array<string> = [];
    let errors: ValidationErrors = this.form.get(control)?.errors as ValidationErrors;

    
    if(control == 'confirmPassword'  && this.form.errors) {
      if(errors) {
        errors[Object.keys(this.form.errors)[0]] = this.form.errors;
      } else {
        errors = this.form.errors;
      }
      
    }
    
    const errorsArray: Array<string> = Object.keys(errors);

    errorsArray.forEach((error: string) => {
      if (error == 'required') {
        messages.push(controlName + ' is required');
      } else if (error == 'maxlength') {
        messages.push(controlName + ' cannot exceed 40 characters');
      } else if (error == 'invalidName') {
        messages.push(controlName + ' cannot contain any special characters');
      } else if (error == 'email') {
        messages.push('A valid email is required');
      } else if (error == 'invalidPassword') {
        messages.push('Password must be at least 6 characters');
      } else if (error == 'noPasswordMatch') {
        messages.push('Passwords must match');
      }
    });

    return messages;
  }
}



export function invalidNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value == '') return null;

    const valid = /^\b[a-zA-Z\s]+\b$/.test(control.value);
    return !valid ? { invalidName: { value: control.value } } : null;
  };
}


export function invalidPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value == '') return null;

    const valid = /(?=.*\S).{6,}/.test(control.value);
    return !valid ? { invalidPassword: { value: control.value } } : null;
  };
}


export const matchPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const newPassword = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');

  return newPassword && confirmPassword && newPassword.value != confirmPassword.value ? { noPasswordMatch: true } : null;
};