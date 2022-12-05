import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService, DataService, LazyLoadingService, SpinnerAction } from 'common';
import { Validation } from '../../classes/validation';
import { OtpPopupComponent } from '../otp-popup/otp-popup.component';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';


@Component({
  selector: 'delete-account-form',
  templateUrl: './delete-account-form.component.html',
  styleUrls: ['./delete-account-form.component.scss']
})
export class DeleteAccountFormComponent extends Validation implements OnInit {
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

    this.email = this.accountService.user?.email!;

    this.form = new FormGroup({
      otp: new FormControl('', {
        validators: Validators.required,
        updateOn: 'submit'
      }),
      password: new FormControl('', {
        validators: [
          Validators.required,
          this.invalidPasswordValidator()
        ],
        updateOn: 'submit'
      })
    });


    this.form.statusChanges.subscribe((status: string) => {
      if (status == 'VALID') {
        this.dataService.delete('api/Account/DeleteAccount', {
          password: this.form.get('password')?.value,
          oneTimePassword: this.form.get('otp')?.value
        },
          {
            authorization: true,
            spinnerAction: SpinnerAction.Start
          }
        ).subscribe({
          complete: () => {
            this.fade();
            this.accountService.logOut();
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


  onSubmit() {
    this.emailResent = false;
  }


  onResendEmailClick() {
    this.openOtpPopup();

    this.dataService.get('api/Account/CreateDeleteAccountOTP', [],
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
        successPrompt.header = 'Successful Account Deletion';
        successPrompt.message = 'Your account has been successfully deleted.';
      });
  }
}