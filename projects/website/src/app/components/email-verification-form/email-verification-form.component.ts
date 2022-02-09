import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SpinnerAction } from '../../classes/enums';
import { Validation } from '../../classes/validation';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';

@Component({
  selector: 'email-verification-form',
  templateUrl: './email-verification-form.component.html',
  styleUrls: ['./email-verification-form.component.scss']
})
export class EmailVerificationFormComponent extends Validation implements OnInit {
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
            spinnerAction: SpinnerAction.Start
          }
        ).subscribe(() => {
          this.accountService.setCustomer();
          this.OpenSuccessPrompt();
        });
      }
    });
  }



  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.tabElements) this.tabElements[0].nativeElement.focus();
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
    this.dataService.get('api/Account/CreateChangeEmailOTP',
      [{ key: 'email', value: this.email }],
      {
        spinnerAction: SpinnerAction.StartEnd,
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