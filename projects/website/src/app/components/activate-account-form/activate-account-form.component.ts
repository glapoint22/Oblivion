import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { AccountService, DataService, LazyLoadingService, SpinnerAction } from 'common';
import { Validation } from '../../classes/validation';
import { OtpPopupComponent } from '../otp-popup/otp-popup.component';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';

@Component({
  selector: 'activate-account-form',
  templateUrl: './activate-account-form.component.html',
  styleUrls: ['./activate-account-form.component.scss']
})
export class ActivateAccountFormComponent extends Validation {
  public email!: string;
  public emailResent!: boolean;
  @ViewChild('otpResentPopupContainer', { read: ViewContainerRef }) otpResentPopupContainer!: ViewContainerRef;

  constructor
    (
      dataService: DataService,
      lazyLoadingService: LazyLoadingService,
      private accountService: AccountService,
    ) { super(dataService, lazyLoadingService) }


  ngOnInit(): void {
    super.ngOnInit();
    this.form = new UntypedFormGroup({
      otp: new UntypedFormControl('', {
        validators: Validators.required,
        updateOn: 'submit'
      })
    });

    this.form.statusChanges.subscribe((status: string) => {
      if (status == 'VALID') {
        this.dataService.post('api/Account/ActivateAccount', {
          email: this.email,
          oneTimePassword: this.form.get('otp')?.value,
        }, { spinnerAction: SpinnerAction.Start })
          .subscribe({
            complete: () => {
              this.accountService.logIn();
              this.OpenSuccessPrompt();
            },
            error: (error: HttpErrorResponse) => {
              if (error.status < 500) {
                this.form.controls.otp.setErrors({ incorrectOneTimePassword: true });
              }
            }
          })
      }
    });
  }


  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.setFocus(0);
  }


  onSubmit() {
    this.emailResent = false;
  }


  async OpenSuccessPrompt() {
    this.fade();

    this.lazyLoadingService.load(async () => {
      const { SuccessPromptComponent } = await import('../success-prompt/success-prompt.component');
      const { SuccessPromptModule } = await import('../success-prompt/success-prompt.module');

      return {
        component: SuccessPromptComponent,
        module: SuccessPromptModule
      }
    }, SpinnerAction.End).then((successPrompt: SuccessPromptComponent) => {
      successPrompt.header = 'Successful Account Activation';
      successPrompt.message = 'Your account has been successfully Activated.';
    });
  }



  onResendEmailClick() {
    this.openOtpPopup();

    this.dataService.get('api/Account/ResendAccountActivationEmail',
      [{ key: 'email', value: this.email }],
      {
        spinnerAction: SpinnerAction.None
      }
    ).subscribe();
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
      otpPopup.onClose.subscribe(()=> {
        this.emailResent = false;
      })
    })
  }
}