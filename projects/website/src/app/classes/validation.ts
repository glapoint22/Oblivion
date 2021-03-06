import { Directive } from "@angular/core";
import { AbstractControl, AsyncValidatorFn, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from "common";
import { Observable } from "rxjs";

@Directive()
export class Validation extends LazyLoad {
  public form!: FormGroup;

  constructor(public dataService: DataService, lazyLoadingService: LazyLoadingService) { super(lazyLoadingService) }


  getErrorMessages(control: string, controlName: string): Array<string> {
    let messages: Array<string> = [];
    let errors: ValidationErrors = this.form.get(control)?.errors as ValidationErrors;


    if (control == 'confirmPassword' && this.form.errors) {
      if (errors) {
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
      } else if (error == 'incorrectOneTimePassword') {
        messages.push('One-time password is incorrect');
      } else if (error == 'duplicateEmail') {
        messages.push('That email address is already taken')
      } else if (error == 'incorrectPassword') {
        messages.push('Password is incorrect');
      } else if (error == 'noEmail') {
        messages.push('The email you entered is not associated with any Niche Shack account. Please provide a different email address.');
      }
    });

    return messages;
  }

  invalidNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == '') return null;

      const valid = /^\b[a-zA-Z\s]+\b$/.test(control.value);
      return !valid ? { invalidName: { value: control.value } } : null;
    };
  }


  invalidPasswordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value == '') return null;

      const valid = /(?=.*\S).{6,}/.test(control.value);
      return !valid ? { invalidPassword: { value: control.value } } : null;
    };
  }


  matchPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    return newPassword && confirmPassword && newPassword.value != confirmPassword.value ? { noPasswordMatch: true } : null;
  };


  validateEmailAsync(apiUrl: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return this.dataService.get(apiUrl,
        [{ key: 'email', value: control.value }], {
        spinnerAction: SpinnerAction.Start,
        endSpinnerWhen: (result: any) => result && result.duplicateEmail
      });
    };
  }


  validatePasswordAsync(apiUrl: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return this.dataService.get(apiUrl,
        [{ key: 'password', value: control.value }], {
        spinnerAction: SpinnerAction.Start,
        authorization: true,
        endSpinnerWhen: (result: any) => result && result.incorrectPassword
      });
    };
  }


  validateOneTimePasswordAsync(apiUrl: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return this.dataService.get(apiUrl,
        [{ key: 'oneTimePassword', value: control.value }], {
        spinnerAction: SpinnerAction.Start,
        endSpinnerWhen: (result: any) => result && result.incorrectOneTimePassword,
        authorization: true
      });
    };
  }


  checkEmailAsync(apiUrl: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      return this.dataService.get(apiUrl,
        [{ key: 'email', value: control.value }], {
        spinnerAction: SpinnerAction.Start,
        endSpinnerWhen: (result: any) => result && result.noEmail
      });
    };
  }
}