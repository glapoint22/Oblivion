import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { invalidNameValidator, invalidPasswordValidator, Validation } from '../../classes/validation';
import { AccountActivationPromptComponent } from '../../components/account-activation-prompt/account-activation-prompt.component';
import { EmailExistsPromptComponent } from '../../components/email-exists-prompt/email-exists-prompt.component';
import { DataService } from '../../services/data/data.service';
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
  public isLoginPage!: boolean;

  constructor
    (
      private lazyLoadingService: LazyLoadingService,
      private spinnerService: SpinnerService,
      private dataService: DataService,
      private router: Router
    ) { super() }


  ngOnInit(): void {
    this.isLoginPage = this.router.url.includes('log-in');


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
      this.dataService.post('api/Account/Register', {
        firstName: this.form.get('firstName')?.value,
        lastName: this.form.get('lastName')?.value,
        email: this.form.get('email')?.value,
        password: this.form.get('password')?.value
      }).subscribe((result: any) => {
        if(result && result.failure) {
          this.openEmailExistsPrompt();
        } else {
          this.openAccountActivationPrompt();
        }
      });
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
  


  async openEmailExistsPrompt() {
    this.spinnerService.show = true;
    this.fade();
    const { EmailExistsPromptComponent } = await import('../../components/email-exists-prompt/email-exists-prompt.component');
    const { EmailExistsPromptModule } = await import('../../components/email-exists-prompt/email-exists-prompt.module');

    this.lazyLoadingService.getComponentAsync(EmailExistsPromptComponent, EmailExistsPromptModule, this.lazyLoadingService.container)
      .then((emailExistsPrompt: EmailExistsPromptComponent) => {
        emailExistsPrompt.email = this.form.get('email')?.value;
        emailExistsPrompt.createAccountForm = this;
        this.spinnerService.show = false;
      });
  }




  async openAccountActivationPrompt() {
    this.spinnerService.show = true;
    this.fade();
    const { AccountActivationPromptComponent } = await import('../../components/account-activation-prompt/account-activation-prompt.component');
    const { AccountActivationPromptModule } = await import('../../components/account-activation-prompt/account-activation-prompt.module');

    this.lazyLoadingService.getComponentAsync(AccountActivationPromptComponent, AccountActivationPromptModule, this.lazyLoadingService.container)
      .then((accountActivationPrompt: AccountActivationPromptComponent) => {
        accountActivationPrompt.email = this.form.get('email')?.value;
        accountActivationPrompt.createAccountForm = this;
        this.spinnerService.show = false;
      });
  }


  close() {
    super.close();
    if (this.signUpForm) this.signUpForm.close();
  }
}