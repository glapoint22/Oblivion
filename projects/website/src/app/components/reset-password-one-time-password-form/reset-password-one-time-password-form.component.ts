import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { SpinnerAction } from '../../classes/enums';
import { Validation } from '../../classes/validation';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
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
      lazyLoadingService: LazyLoadingService
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
      }, {
        spinnerAction: SpinnerAction.Start,
        endSpinnerWhen: (result: any) => result && result.incorrectOneTimePassword
      });
    };
  }


  async OpenResetPasswordForm() {
    this.fade();

    this.lazyLoadingService.load(async () => {
      const { ResetPasswordFormComponent } = await import('../reset-password-form/reset-password-form.component');
      const { ResetPasswordFormModule } = await import('../reset-password-form/reset-password-form.module');

      return {
        component: ResetPasswordFormComponent,
        module: ResetPasswordFormModule
      }
    }, SpinnerAction.End)
      .then((resetPasswordForm: ResetPasswordFormComponent) => {
        resetPasswordForm.email = this.email;
        resetPasswordForm.oneTimePassword = this.form.get('otp')?.value;
      });
  }

  onResendEmailClick() {
    this.dataService.get('api/Account/ForgotPassword', [{
      key: 'email',
      value: this.email
    }], {
      spinnerAction: SpinnerAction.StartEnd
    }).subscribe(() => {
      this.emailResent = true;
    });
  }
}