import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SpinnerAction } from '../../classes/enums';
import { Validation } from '../../classes/validation';
import { ResetPasswordOneTimePasswordFormComponent } from '../../components/reset-password-one-time-password-form/reset-password-one-time-password-form.component';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';

@Component({
  selector: 'forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.scss']
})
export class ForgotPasswordFormComponent extends Validation implements OnInit {
  public isLoginPage!: boolean;

  constructor
    (
      dataService: DataService,
      lazyLoadingService: LazyLoadingService,
      private router: Router
    ) { super(dataService, lazyLoadingService) }


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
        }], { spinnerAction: SpinnerAction.Start }).subscribe(() => {
          this.fade();
          this.openResetPasswordOneTimePasswordForm(this.form.get('email')?.value);
        });
      }
    });
  }



  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.setFocus(0);
  }


  async onLogInLinkClick() {
    this.fade();

    this.lazyLoadingService.load(async () => {
      const { LogInFormComponent } = await import('../log-in-form/log-in-form.component');
      const { LogInFormModule } = await import('../log-in-form/log-in-form.module');

      return {
        component: LogInFormComponent,
        module: LogInFormModule
      }
    }, SpinnerAction.StartEnd);
  }


  async openResetPasswordOneTimePasswordForm(email: string) {
    this.fade();

    this.lazyLoadingService.load(async () => {
      const { ResetPasswordOneTimePasswordFormComponent } = await import('../../components/reset-password-one-time-password-form/reset-password-one-time-password-form.component');
      const { ResetPasswordOneTimePasswordFormModule } = await import('../../components/reset-password-one-time-password-form/reset-password-one-time-password-form.module');

      return {
        component: ResetPasswordOneTimePasswordFormComponent,
        module: ResetPasswordOneTimePasswordFormModule
      }
    }, SpinnerAction.End)
      .then((emailSentPrompt: ResetPasswordOneTimePasswordFormComponent) => {
        emailSentPrompt.email = email;
      });
  }


  onEnter(e: KeyboardEvent): void {
    if (this.tabElements && this.tabElements[2].nativeElement == document.activeElement) {
      this.onLogInLinkClick();
    }
  }
}