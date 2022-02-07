import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Validation } from '../../classes/validation';
import { ResetPasswordOneTimePasswordFormComponent } from '../../components/reset-password-one-time-password-form/reset-password-one-time-password-form.component';
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
  public logInForm!: LogInFormComponent;
  public isLoginPage!: boolean;

  constructor
    (
      dataService: DataService,
      private lazyLoadingService: LazyLoadingService,
      private spinnerService: SpinnerService,
      private router: Router
    ) { super(dataService) }


  ngOnInit(): void {
    super.ngOnInit();
    this.isLoginPage = this.router.url.includes('log-in');

    this.form = new FormGroup({
      email: new FormControl('', {
        validators: [
          Validators.required,
          Validators.email
        ],
        asyncValidators: this.checkEmailAsync('api/Account/CheckEmail'),
        updateOn: 'submit'
      })
    });

    this.form.statusChanges.subscribe((status: string) => {
      if (status == 'VALID') {
        this.dataService.get('api/Account/ForgotPassword', [{
          key: 'email',
          value: this.form.get('email')?.value
        }]).subscribe(() => {
          this.fade();
          this.openResetPasswordOneTimePasswordForm(this.form.get('email')?.value);
        });
      }
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
        logInForm.forgotPasswordForm = this;
        this.spinnerService.show = false;
      });
  }


  async openResetPasswordOneTimePasswordForm(email: string) {
    this.spinnerService.show = true;
    const { ResetPasswordOneTimePasswordFormComponent } = await import('../../components/reset-password-one-time-password-form/reset-password-one-time-password-form.component');
    const { ResetPasswordOneTimePasswordFormModule } = await import('../../components/reset-password-one-time-password-form/reset-password-one-time-password-form.module');

    this.lazyLoadingService.getComponentAsync(ResetPasswordOneTimePasswordFormComponent, ResetPasswordOneTimePasswordFormModule, this.lazyLoadingService.container)
      .then((emailSentPrompt: ResetPasswordOneTimePasswordFormComponent) => {
        emailSentPrompt.email = email;
        this.spinnerService.show = false;
      });
  }


  close() {
    super.close();
    if (this.logInForm) this.logInForm.close();
  }
}