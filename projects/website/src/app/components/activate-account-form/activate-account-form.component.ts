import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { Validation } from '../../classes/validation';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
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
      private lazyLoadingService: LazyLoadingService,
      private accountService: AccountService,
      private spinnerService: SpinnerService
    ) { super(dataService) }


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
        }, { showSpinner: true })
          .subscribe(() => {
            this.accountService.logIn();
            this.fade();
            this.OpenSuccessPrompt();
          });
      }
    });
  }


  onSubmit() {
    this.emailResent = false;
  }


  async OpenSuccessPrompt() {
    const { SuccessPromptComponent } = await import('../success-prompt/success-prompt.component');
    const { SuccessPromptModule } = await import('../success-prompt/success-prompt.module');

    this.lazyLoadingService.getComponentAsync(SuccessPromptComponent, SuccessPromptModule, this.lazyLoadingService.container)
      .then((successPrompt: SuccessPromptComponent) => {
        successPrompt.header = 'Successful Account Activation';
        successPrompt.message = 'Your account has been successfully Activated.';
        this.spinnerService.show = false;
      });
  }

  validateOneTimePassword(): AsyncValidatorFn {
    return (): Observable<ValidationErrors> => {
      return this.dataService.post('api/Account/ValidateActivateAccountOneTimePassword', {
        email: this.email,
        oneTimePassword: this.form.get('otp')?.value,
      }, { showSpinner: true });
    }
  }





  onResendEmailClick() {
    this.dataService.get('api/Account/ResendAccountActivationEmail',
      [{ key: 'email', value: this.email }],
      {
        showSpinner: true
      }
    ).subscribe(() => {
      this.emailResent = true;
    });
  }
}