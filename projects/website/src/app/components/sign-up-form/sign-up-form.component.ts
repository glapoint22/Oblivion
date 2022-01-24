import { Component } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { CreateAccountFormComponent } from '../create-account-form/create-account-form.component';
import { LogInFormComponent } from '../log-in-form/log-in-form.component';

@Component({
  selector: 'sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.scss']
})
export class SignUpFormComponent extends LazyLoad {
  constructor(private lazyLoadingService: LazyLoadingService, private spinnerService: SpinnerService) { super() }
  public logInForm!: LogInFormComponent;


  async onCreateAccountButtonClick(): Promise<void> {
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
}