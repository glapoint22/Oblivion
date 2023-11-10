import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { DataService, LazyLoadingService, SpinnerAction } from 'common';
import { Validation } from '../../classes/validation';
import { OtpPopupComponent } from '../otp-popup/otp-popup.component';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss']
})
export class ResetPasswordFormComponent extends Validation {
  public email!: string;
  public emailResent!: boolean;
  private dataServiceGetSubscription!: Subscription;
  private dataServicePostSubscription!: Subscription;
  @ViewChild('otpResentPopupContainer', { read: ViewContainerRef }) otpResentPopupContainer!: ViewContainerRef;

  constructor
    (
      dataService: DataService,
      lazyLoadingService: LazyLoadingService
    ) { super(dataService, lazyLoadingService) }

  ngOnInit(): void {
    super.ngOnInit();
    this.form = new UntypedFormGroup({
      otp: new UntypedFormControl('', {
        validators: Validators.required,
        updateOn: 'submit'
      }),

      newPassword: new UntypedFormControl('', {
        validators: [
          Validators.required,
          this.invalidPasswordValidator()
        ],
        updateOn: 'submit'
      }),
      confirmPassword: new UntypedFormControl('', {
        validators: [
          Validators.required,
          this.invalidPasswordValidator()
        ],
        updateOn: 'submit'
      })
    }, {
      validators: this.matchPasswordValidator,
      updateOn: 'submit'
    });
  }


  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.setFocus(0);
  }


  onSubmit() {
    if (this.form.valid) {
      this.dataServicePostSubscription = this.dataService.post('api/Account/ResetPassword', {
        email: this.email,
        newPassword: this.form.get('newPassword')?.value,
        oneTimePassword: this.form.get('otp')?.value
      }, { spinnerAction: SpinnerAction.Start })
        .subscribe({
          complete: () => {
            this.OpenSuccessPrompt();
          },
          error: (error: HttpErrorResponse) => {
            if (error.status == 409) {
              this.form.controls.otp.setErrors({ incorrectOneTimePassword: true });
            }
          }
        });
    }
  }


  onResendEmailClick() {
    this.openOtpPopup();

    this.dataServiceGetSubscription = this.dataService.get('api/Account/ForgotPassword', [{
      key: 'email',
      value: this.email
    }]).subscribe();
  }




  openOtpPopup() {
    this.emailResent = true;

    this.lazyLoadingService.load(async () => {
      const { OtpPopupComponent } = await import('../otp-popup/otp-popup.component');
      const { OtpPopupModule } = await import('../otp-popup/otp-popup.module');

      return {
        component: OtpPopupComponent,
        module: OtpPopupModule
      }
    }, SpinnerAction.None, this.otpResentPopupContainer).then((otpPopup: OtpPopupComponent)=> {
      const otpPopupOnCloseSubscription = otpPopup.onClose.subscribe(()=> {
        otpPopupOnCloseSubscription.unsubscribe();
        this.emailResent = false;
      })
    })
  }





  async OpenSuccessPrompt() {
    this.fade();

    this.lazyLoadingService.load(async () => {
      const { SuccessPromptComponent } = await import('../../components/success-prompt/success-prompt.component');
      const { SuccessPromptModule } = await import('../../components/success-prompt/success-prompt.module');

      return {
        component: SuccessPromptComponent,
        module: SuccessPromptModule
      }
    }, SpinnerAction.End)
      .then((successPromptComponent: SuccessPromptComponent) => {
        successPromptComponent.header = 'Successful Password Reset';
        successPromptComponent.message = 'Your password has been successfully reset.';
      });
  }



  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.dataServiceGetSubscription) this.dataServiceGetSubscription.unsubscribe();
    if (this.dataServicePostSubscription) this.dataServicePostSubscription.unsubscribe();
  }
}
