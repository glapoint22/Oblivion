import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { LazyLoadingService } from './services/lazy-loading/lazy-loading.service';
import { ModalService } from './services/modal/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private container: ViewContainerRef, private lazyLoadingService: LazyLoadingService, private modalService: ModalService) { }


  ngOnInit(): void {
    this.modalService.container = this.container;
  }



  async openSignUpForm(): Promise<void> {
    const { SignUpFormModule } = await import('./components/sign-up-form/sign-up-form.module');
    const { SignUpFormComponent } = await import('./components/sign-up-form/sign-up-form.component');

    this.lazyLoadingService.getModuleRef(SignUpFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(SignUpFormComponent, this.container, 0, moduleRef.injector);
      });
  }


  async openLogInForm(): Promise<void> {
    const { LogInFormModule } = await import('./components/log-in-form/log-in-form.module');
    const { LogInFormComponent } = await import('./components/log-in-form/log-in-form.component');

    this.lazyLoadingService.getModuleRef(LogInFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(LogInFormComponent, this.container, 0, moduleRef.injector);
      });
  }


  async openCreateAccountForm(): Promise<void> {
    const { CreateAccountFormComponent } = await import('./components/create-account-form/create-account-form.component');
    const { CreateAccountFormModule } = await import('./components/create-account-form/create-account-form.module');

    this.lazyLoadingService.getModuleRef(CreateAccountFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(CreateAccountFormComponent, this.container, 0, moduleRef.injector);
      });


  }



  async openForgotPasswordForm() {
    const { ForgotPasswordFormComponent } = await import('./components/forgot-password-form/forgot-password-form.component');
    const { ForgotPasswordFormModule } = await import('./components/forgot-password-form/forgot-password-form.module');

    this.lazyLoadingService.getModuleRef(ForgotPasswordFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(ForgotPasswordFormComponent, this.container, 0, moduleRef.injector);
      });
  }





  async openEmailSentPrompt() {
    const { EmailSentPromptComponent } = await import('./components/email-sent-prompt/email-sent-prompt.component');
    this.lazyLoadingService.createComponent(EmailSentPromptComponent, this.container);
  }
}