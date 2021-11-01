import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { invalidPasswordValidator, matchPasswordValidator, Validation } from '../../classes/validation';

@Component({
  selector: 'create-password-form',
  templateUrl: './create-password-form.component.html',
  styleUrls: ['./create-password-form.component.scss']
})
export class CreatePasswordFormComponent extends Validation implements OnInit {
  public externalLoginProvider: string = 'Zuckabuck';
  public email: string = 'trumpy@usa.com';

  ngOnInit(): void {
    this.form = new FormGroup({
      'newPassword': new FormControl('', [
        Validators.required,
        invalidPasswordValidator()
      ]),
      'confirmPassword': new FormControl('', [
        Validators.required,
        invalidPasswordValidator()
      ])
    }, { validators: matchPasswordValidator });
  }


  onSubmit() {
    if (this.form.valid) {
      console.log('Submit');
    }
  }

}
