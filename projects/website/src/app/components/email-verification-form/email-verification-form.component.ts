import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { AccountService, DataService, LazyLoadingService, SpinnerAction } from 'common';
import { Validation } from '../../classes/validation';
import { OtpPopupComponent } from '../otp-popup/otp-popup.component';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';

@Component({
  selector: 'email-verification-form',
  templateUrl: './email-verification-form.component.html',
  styleUrls: ['./email-verification-form.component.scss']
})
export class EmailVerificationFormComponent extends Validation implements OnInit {
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
      }),
      password: new UntypedFormControl('', {
        validators: [
          Validators.required,
          this.invalidPasswordValidator()
        ],
        updateOn: 'submit'
      })
    });

    this.form.statusChanges.subscribe((status: string) => {
      if (status == 'VALID') {
        this.dataService.put('api/Account/ChangeEmail', {
          newEmail: this.email,
          password: this.form.get('password')?.value,
          oneTimePassword: this.form.get('otp')?.value
        },
          {
            authorization: true,
            spinnerAction: SpinnerAction.Start
          }
        ).subscribe({
          complete: () => {
            this.accountService.setUser();
            this.OpenSuccessPrompt();
          },
          error: (error: HttpErrorResponse) => {
            if (error.status == 401) {
              this.form.controls.password.setErrors({ incorrectPassword: true });
            } else if (error.status == 409) {
              this.form.controls.otp.setErrors({ incorrectOneTimePassword: true });
            }
          }
        });
      }
    });
  }



  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.setFocus(0);
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
    }, SpinnerAction.End)
      .then((successPrompt: SuccessPromptComponent) => {
        successPrompt.header = 'Successful Email Change';
        successPrompt.message = 'Your email has been successfully changed.';
      });
  }




  onResendEmailClick() {
    this.openOtpPopup();

    this.dataService.get('api/Account/CreateChangeEmailOTP',
      [{ key: 'email', value: this.email }],
      {
        spinnerAction: SpinnerAction.None,
        authorization: true
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







  onSubmit() {
    this.emailResent = false;
  }
}