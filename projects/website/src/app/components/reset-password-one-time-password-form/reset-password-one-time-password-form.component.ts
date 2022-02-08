import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { Validation } from '../../classes/validation';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { ResetPasswordFormComponent } from '../reset-password-form/reset-password-form.component';

@Component({
  selector: 'reset-password-one-time-password-form',
  templateUrl: './reset-password-one-time-password-form.component.html',
  styleUrls: ['./reset-password-one-time-password-form.component.scss']
})
export class ResetPasswordOneTimePasswordFormComponent extends Validation implements OnInit {
  public email!: string;
  public emailResent!: boolean;

  constructor
    (
      dataService: DataService,
      lazyLoadingService: LazyLoadingService,
      private spinnerService: SpinnerService
    ) { super(dataService, lazyLoadingService) }

  ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup({
      otp: new FormControl('', {
        validators: Validators.required,
        asyncValidators: this.validateOneTimePassword(),
        updateOn: 'submit'
      })
    });

    this.form.statusChanges.subscribe((status: string) => {
      if (status == 'VALID') {
        this.OpenResetPasswordForm();
      }
    });
  }


  onSubmit() {
    this.emailResent = false;
  }


  validateOneTimePassword(): AsyncValidatorFn {
    return (): Observable<ValidationErrors> => {
      return this.dataService.post('api/Account/ValidateResetPasswordOTP', {
        oneTimePassword: this.form.get('otp')?.value,
        email: this.email
      }, { showSpinner: true })
    };
  }


  async OpenResetPasswordForm() {
    this.fade();
    const { ResetPasswordFormComponent } = await import('../reset-password-form/reset-password-form.component');
    const { ResetPasswordFormModule } = await import('../reset-password-form/reset-password-form.module');

    this.lazyLoadingService.getComponentAsync(ResetPasswordFormComponent, ResetPasswordFormModule, this.lazyLoadingService.container)
      .then((resetPasswordForm: ResetPasswordFormComponent) => {
        resetPasswordForm.email = this.email;
        resetPasswordForm.oneTimePassword = this.form.get('otp')?.value;
        this.spinnerService.show = false;
      });
  }

  onResendEmailClick() {
    this.dataService.get('api/Account/ForgotPassword', [{
      key: 'email',
      value: this.email
    }], {
      showSpinner: true
    }).subscribe(() => {
      this.emailResent = true;
    });
  }
}