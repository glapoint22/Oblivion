import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { invalidNameValidator, invalidPasswordValidator, Validation } from '../../classes/validation';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { LogInFormComponent } from '../log-in-form/log-in-form.component';
import { SignUpFormComponent } from '../sign-up-form/sign-up-form.component';


@Component({
  selector: 'create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrls: ['./create-account-form.component.scss']
})
export class CreateAccountFormComponent extends Validation implements OnInit {
  public signUpForm!: SignUpFormComponent;

  constructor(private lazyLoadingService: LazyLoadingService, private spinnerService: SpinnerService) { super() }


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
        invalidPasswordValidator()
      ])
    });
  }


  onSubmit() {
    if (this.form.valid) {
      console.log('Submit');
    }
  }


  async onLogInLinkClick() {
    this.spinnerService.show = true;
    this.fade();
    const { LogInFormComponent } = await import('../log-in-form/log-in-form.component');
    const { LogInFormModule } = await import('../log-in-form/log-in-form.module')

    this.lazyLoadingService.getComponentAsync(LogInFormComponent, LogInFormModule, this.lazyLoadingService.container)
      .then((loginForm: LogInFormComponent) => {
        loginForm.createAccountForm = this;
        this.spinnerService.show = false;
      });
  }


  close() {
    super.close();
    if (this.signUpForm) this.signUpForm.close();
  }
}