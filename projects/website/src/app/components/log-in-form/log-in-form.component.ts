import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { invalidPasswordValidator, Validation } from '../../classes/validation';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { CreateAccountFormComponent } from '../create-account-form/create-account-form.component';
import { ForgotPasswordFormComponent } from '../forgot-password-form/forgot-password-form.component';
import { SignUpFormComponent } from '../sign-up-form/sign-up-form.component';

@Component({
  selector: 'log-in-form',
  templateUrl: './log-in-form.component.html',
  styleUrls: ['./log-in-form.component.scss']
})
export class LogInFormComponent extends Validation implements OnInit {
  public isPersistent: boolean = true;
  public createAccountForm!: CreateAccountFormComponent;
  public forgotPasswordForm!: ForgotPasswordFormComponent;
  public signUpForm!: SignUpFormComponent

  constructor(
    private dataService: DataService,
    private accountService: AccountService,
    private lazyLoadingService: LazyLoadingService,
    private spinnerService: SpinnerService
  ) { super() }


  ngOnInit(): void {
    this.form = new FormGroup({
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


  onLogIn() {
    if (this.form.valid) {
      this.dataService.post('api/Account/SignIn', {
        email: this.form.get('email')?.value,
        password: this.form.get('password')?.value,
        isPersistent: this.isPersistent
      }).subscribe(() => {
        this.accountService.setCustomer();
        this.close();
      })
    }
  }


  async onSignUpLinkClick() {
    this.spinnerService.show = true;
    this.fade();
    const { SignUpFormComponent } = await import('../sign-up-form/sign-up-form.component');
    const { SignUpFormModule } = await import('../sign-up-form/sign-up-form.module')

    this.lazyLoadingService.getComponentAsync(SignUpFormComponent, SignUpFormModule, this.lazyLoadingService.container)
      .then((signUpForm: SignUpFormComponent) => {
        signUpForm.logInForm = this;
        this.spinnerService.show = false;
      });
  }


  async onForgotPasswordLinkClick() {
    this.spinnerService.show = true;
    this.fade();
    const { ForgotPasswordFormComponent } = await import('../forgot-password-form/forgot-password-form.component');
    const { ForgotPasswordFormModule } = await import('../forgot-password-form/forgot-password-form.module');

    this.lazyLoadingService.getComponentAsync(ForgotPasswordFormComponent, ForgotPasswordFormModule, this.lazyLoadingService.container)
      .then((forgotPasswordForm: ForgotPasswordFormComponent) => {
        forgotPasswordForm.logInForm = this;
        this.spinnerService.show = false;
      });
  }

  close() {
    super.close();
    if (this.signUpForm) this.signUpForm.close();
    if (this.createAccountForm) this.createAccountForm.close();
    if (this.forgotPasswordForm) this.forgotPasswordForm.close();
  }
}