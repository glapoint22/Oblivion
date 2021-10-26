import { Directive } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Modal } from "./modal";

@Directive()
export class Validation extends Modal {
  public form!: FormGroup;


  ngOnInit(): void {
    const namePattern = new RegExp(/^\b[a-zA-Z\s]+\b$/);
    const passwordPattern = new RegExp(/(?=.*\S).{6,}/);

    this.form = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern(namePattern),
        Validators.maxLength(40)
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern(namePattern)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(passwordPattern)
      ])
    });
  }

  getErrorMessages(control: string): Array<string> {
    let messages: Array<string> = [];

    switch (control) {
      case 'firstName':
        const errors = this.form.get('firstName')?.errors;

        if (errors?.required) {
          messages.push('First name is required');
        }
        if (errors?.maxlength) {
          messages.push('First name cannot exceed 40 characters');
        }

        if (errors?.pattern) {
          messages.push('First name cannot contain any special characters');
        }

        break;

      default:
        break;
    }

    return messages;
  }
}