import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Validation } from '../../classes/validation';
import { EmailSentPromptComponent } from '../../components/email-sent-prompt/email-sent-prompt.component';
import { LogInComponent } from '../../pages/log-in/log-in.component';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { LogInFormComponent } from '../log-in-form/log-in-form.component';

@Component({
  selector: 'forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.scss']
})
export class ForgotPasswordFormComponent extends Validation implements OnInit {
  public isError!: boolean;
  public logInForm!: LogInFormComponent;
  public isLoginPage!: boolean;

  constructor
    (
      private lazyLoadingService: LazyLoadingService,
      private spinnerService: SpinnerService,
      private dataService: DataService,
      private router: Router
    ) { super() }


  ngOnInit(): void {
    super.ngOnInit();
    this.isLoginPage = this.router.url.includes('log-in');

    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ])
    });
  }


  onSubmit() {
    this.isError = false;
    if (this.form.valid) {
      this.dataService.get<boolean>('api/Account/ForgetPassword', [{
        key: 'email',
        value: this.form.get('email')?.value
      }]).subscribe((isError: boolean) => {
        if (isError) {
          this.isError = true;
        } else {
          this.fade();
          this.openEmailSentPrompt(this.form.get('email')?.value);
        }
      });
    }
  }


  async onLogInLinkClick() {
    document.removeEventListener("keydown", this.keyDown);
    this.spinnerService.show = true;
    this.fade();
    const { LogInFormComponent } = await import('../log-in-form/log-in-form.component');
    const { LogInFormModule } = await import('../log-in-form/log-in-form.module')

    this.lazyLoadingService.getComponentAsync(LogInFormComponent, LogInFormModule, this.lazyLoadingService.container)
      .then((logInForm: LogInFormComponent) => {
        logInForm.forgotPasswordForm = this;
        this.spinnerService.show = false;
      });
  }


  async openEmailSentPrompt(email: string) {
    document.removeEventListener("keydown", this.keyDown);
    this.spinnerService.show = true;
    const { EmailSentPromptComponent } = await import('../../components/email-sent-prompt/email-sent-prompt.component');
    const { EmailSentPromptModule } = await import('../../components/email-sent-prompt/email-sent-prompt.module');

    this.lazyLoadingService.getComponentAsync(EmailSentPromptComponent, EmailSentPromptModule, this.lazyLoadingService.container)
      .then((emailSentPrompt: EmailSentPromptComponent) => {
        emailSentPrompt.email = email;
        emailSentPrompt.forgotPasswordForm = this;
        this.spinnerService.show = false;
      });
  }


  close() {
    super.close();
    if (this.logInForm) this.logInForm.close();
  }
}