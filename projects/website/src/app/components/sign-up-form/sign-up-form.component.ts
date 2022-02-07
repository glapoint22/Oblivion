import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoad } from '../../classes/lazy-load';
import { AccountService } from '../../services/account/account.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { CreateAccountFormComponent } from '../create-account-form/create-account-form.component';
import { LogInFormComponent } from '../log-in-form/log-in-form.component';

@Component({
  selector: 'sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.scss']
})
export class SignUpFormComponent extends LazyLoad implements OnInit {
  public logInForm!: LogInFormComponent;
  public isLoginPage!: boolean;

  constructor
    (
      private lazyLoadingService: LazyLoadingService,
      private spinnerService: SpinnerService,
      private router: Router,
      private accountService: AccountService
    ) { super() }

  ngOnInit(): void {
    super.ngOnInit();
    this.isLoginPage = this.router.url.includes('log-in');
  }


  async onCreateAccountButtonClick(): Promise<void> {
    document.removeEventListener("keydown", this.keyDown);
    this.spinnerService.show = true;
    this.fade();
    const { CreateAccountFormComponent } = await import('../create-account-form/create-account-form.component');
    const { CreateAccountFormModule } = await import('../create-account-form/create-account-form.module');

    this.lazyLoadingService.getComponentAsync(CreateAccountFormComponent, CreateAccountFormModule, this.lazyLoadingService.container)
      .then((createAccountForm: CreateAccountFormComponent) => {
        createAccountForm.signUpForm = this;
        this.spinnerService.show = false;
      });
  }


  async onLogInLinkClick() {
    document.removeEventListener("keydown", this.keyDown);
    this.spinnerService.show = true;
    this.fade();
    const { LogInFormComponent } = await import('../log-in-form/log-in-form.component');
    const { LogInFormModule } = await import('../log-in-form/log-in-form.module')

    this.lazyLoadingService.getComponentAsync(LogInFormComponent, LogInFormModule, this.lazyLoadingService.container)
      .then((logInForm: LogInFormComponent) => {
        logInForm.signUpForm = this;
        this.spinnerService.show = false;
      });
  }


  close() {
    super.close();
    if (this.logInForm) this.logInForm.close();
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
}