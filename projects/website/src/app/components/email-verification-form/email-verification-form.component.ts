import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Validation } from '../../classes/validation';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { ChangeEmailFormComponent } from '../change-email-form/change-email-form.component';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';

@Component({
  selector: 'email-verification-form',
  templateUrl: './email-verification-form.component.html',
  styleUrls: ['./email-verification-form.component.scss']
})
export class EmailVerificationFormComponent extends Validation implements OnInit {
  public email!: string;
  public changeEmailForm!: ChangeEmailFormComponent;
  public emailResent!: boolean;

  constructor
    (
      dataService: DataService,
      private lazyLoadingService: LazyLoadingService,
      private accountService: AccountService,
      private spinnerService: SpinnerService
    ) { super(dataService) }


  ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup({
      otp: new FormControl('', {
        validators: Validators.required,
        asyncValidators: this.validateOneTimePasswordAsync('api/Account/ValidateEmailChangeOneTimePassword'),
        updateOn: 'submit'
      }),
      password: new FormControl('', {
        validators: [
          Validators.required,
          this.invalidPasswordValidator()
        ],
        asyncValidators: this.validatePasswordAsync('api/Account/ValidatePassword'),
        updateOn: 'submit'
      })
    });

    this.form.statusChanges.subscribe((status: string) => {
      if (status == 'VALID') {
        this.dataService.put('api/Account/ChangeEmail', {
          email: this.email,
          password: this.form.get('password')?.value,
          oneTimePassword: this.form.get('otp')?.value
        },
          {
            authorization: true,
            showSpinner: true
          }
        ).subscribe(() => {
          this.accountService.setCustomer();
          this.fade();
          this.OpenSuccessPrompt();
        });
      }
    });
  }


  async OpenSuccessPrompt() {
    document.removeEventListener("keydown", this.keyDown);
    const { SuccessPromptComponent } = await import('../success-prompt/success-prompt.component');
    const { SuccessPromptModule } = await import('../success-prompt/success-prompt.module');

    this.lazyLoadingService.getComponentAsync(SuccessPromptComponent, SuccessPromptModule, this.lazyLoadingService.container)
      .then((successPrompt: SuccessPromptComponent) => {
        successPrompt.header = 'Successful Email Change';
        successPrompt.message = 'Your email has been successfully changed.';
        successPrompt.emailVerificationForm = this;
        this.spinnerService.show = false;
      });
  }


  close() {
    super.close();
    if (this.changeEmailForm) this.changeEmailForm.close();
  }

  onResendEmailClick() {
    this.dataService.get('api/Account/CreateChangeEmailOTP',
      [{ key: 'email', value: this.email }],
      {
        showSpinner: true,
        authorization: true
      }
    ).subscribe(() => {
      this.emailResent = true;
    });
  }

  onSubmit() {
    this.emailResent = false;
  }
}