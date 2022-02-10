import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { SpinnerAction } from '../../classes/enums';
import { Validation } from '../../classes/validation';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
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
        asyncValidators: this.validateOneTimePassword(),
        updateOn: 'submit'
      })
    });

    this.form.statusChanges.subscribe((status: string) => {
      if (status == 'VALID') {
        this.dataService.post('api/Account/ActivateAccount', {
          email: this.email,
          oneTimePassword: this.form.get('otp')?.value,
        }, { spinnerAction: SpinnerAction.Start })
          .subscribe(() => {
            this.accountService.logIn();
            this.OpenSuccessPrompt();
          });
      }
    });
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

  validateOneTimePassword(): AsyncValidatorFn {
    return (): Observable<ValidationErrors> => {
      return this.dataService.post('api/Account/ValidateActivateAccountOneTimePassword', {
        email: this.email,
        oneTimePassword: this.form.get('otp')?.value,
      }, {
        spinnerAction: SpinnerAction.Start,
        endSpinnerWhen: (result: any) => result && result.incorrectOneTimePassword
      });
    }
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
}