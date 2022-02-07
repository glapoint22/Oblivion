import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { Validation } from '../../classes/validation';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { AccountNotActivatedFormComponent } from '../account-not-activated-form/account-not-activated-form.component';
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
  public signUpForm!: SignUpFormComponent;

  constructor(
    dataService: DataService,
    public accountService: AccountService,
    private lazyLoadingService: LazyLoadingService,
    private spinnerService: SpinnerService
  ) { super(dataService) }


  ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup({
      email: new FormControl('', {
        validators: [
          Validators.required,
          Validators.email
        ],
        updateOn: 'submit'
      }),
      password: new FormControl('', {
        validators: [
          Validators.required,
          this.invalidPasswordValidator()
        ],
        asyncValidators: this.checkEmailPasswordAsync(),
        updateOn: 'submit'
      })
    });

    this.form.statusChanges.subscribe((status: string) => {
      if (status == 'VALID') {
        this.dataService.post('api/Account/LogIn', {
          email: this.form.get('email')?.value,
          password: this.form.get('password')?.value,
          isPersistent: this.isPersistent
        }, {
          showSpinner: true
        }).subscribe((error: any) => {
          if (!error) {
            this.setLogIn();
          } else {
            this.openAccountNotActivatedForm();
          }
        });
      }
    });
  }



  setLogIn() {
    this.accountService.logIn();

    if (this.accountService.onRedirect.observed) {
      this.fade();
      this.accountService.onRedirect.next();

    } else {
      this.close();
    }
  }


  async onSignUpLinkClick() {
    document.removeEventListener("keydown", this.keyDown);
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
    document.removeEventListener("keydown", this.keyDown);
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


  async openAccountNotActivatedForm() {
    document.removeEventListener("keydown", this.keyDown);
    this.spinnerService.show = true;
    this.fade();
    const { AccountNotActivatedFormComponent } = await import('../account-not-activated-form/account-not-activated-form.component');
    const { AccountNotActivatedFormModule } = await import('../account-not-activated-form/account-not-activated-form.module');

    this.lazyLoadingService.getComponentAsync(AccountNotActivatedFormComponent, AccountNotActivatedFormModule, this.lazyLoadingService.container)
      .then((accountNotActivatedPrompt: AccountNotActivatedFormComponent) => {
        accountNotActivatedPrompt.email = this.form.get('email')?.value;
        this.spinnerService.show = false;
      });
  }


  close() {
    super.close();
    if (this.signUpForm) this.signUpForm.close();
    if (this.createAccountForm) this.createAccountForm.close();
    if (this.forgotPasswordForm) this.forgotPasswordForm.close();
  }


  checkEmailPasswordAsync(): AsyncValidatorFn {
    return (): Observable<ValidationErrors> => {
      return this.dataService.post('api/Account/ValidateEmailPassword',
        {
          email: this.form.get('email')?.value,
          password: this.form.get('password')?.value
        }, {
        showSpinner: true
      });
    };
  }
}