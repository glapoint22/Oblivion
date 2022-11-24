import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService, DataService, LazyLoadingService, SpinnerAction } from 'common';
import { Validation } from '../../classes/validation';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';

@Component({
  selector: 'activate-account-form',
  templateUrl: './activate-account-form.component.html',
  styleUrls: ['./activate-account-form.component.scss']
})
export class ActivateAccountFormComponent extends Validation {
  public email!: string;
  public emailResent!: boolean;

  constructor
    (
      dataService: DataService,
      lazyLoadingService: LazyLoadingService,
      private accountService: AccountService,
    ) { super(dataService, lazyLoadingService) }


  ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup({
      otp: new FormControl('', {
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
    this.dataService.get('api/Account/ResendAccountActivationEmail',
      [{ key: 'email', value: this.email }],
      {
        spinnerAction: SpinnerAction.StartEnd
      }
    ).subscribe(() => {
      this.emailResent = true;
    });
  }


  onSpace(e: KeyboardEvent): void {
    e.preventDefault();
  }
}