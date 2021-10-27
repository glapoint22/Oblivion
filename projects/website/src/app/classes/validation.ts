import { Directive } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { Modal } from "./modal";

@Directive()
export class Validation extends Modal {
  public form!: FormGroup;


  ngOnInit(): void {
    this.form = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        invalidNameValidator(),
        Validators.maxLength(40)
      ]),
      lastName: new FormControl('', [
        Validators.required,
        invalidNameValidator(),
        Validators.maxLength(40)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/(?=.*\S).{6,}/)
      ])
    });
  }

  getErrorMessages(control: string, controlName: string): Array<string> {
    let messages: Array<string> = [];
    const errors: ValidationErrors = this.form.get(control)?.errors as ValidationErrors;
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
      } else if (error == 'pattern') {
        messages.push('Password must be at least 6 characters');
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