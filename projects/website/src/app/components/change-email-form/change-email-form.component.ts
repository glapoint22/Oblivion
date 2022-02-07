import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AsyncValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Observable, of, switchMap } from 'rxjs';
import { Validation } from '../../classes/validation';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { EmailVerificationFormComponent } from '../email-verification-form/email-verification-form.component';

@Component({
  selector: 'change-email-form',
  templateUrl: './change-email-form.component.html',
  styleUrls: ['./change-email-form.component.scss']
})
export class ChangeEmailFormComponent extends Validation implements OnInit {

  constructor
    (
      dataService: DataService,
      lazyLoadingService: LazyLoadingService,
      public accountService: AccountService,
      private spinnerService: SpinnerService
    ) {
    super(dataService, lazyLoadingService);
  }


  ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup({
      email: new FormControl(this.accountService.customer?.email, {
        validators: [
          Validators.required,
          Validators.email
        ],
        asyncValidators: this.checkDuplicateEmail(),
        updateOn: 'submit',
      })
    });
  }


  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    if (this.tabElements) this.tabElements[0].nativeElement.focus();
  }


  


  async openEmailverificationForm() {
    this.fade();
    const { EmailVerificationFormComponent } = await import('../email-verification-form/email-verification-form.component');
    const { EmailVerificationFormModule } = await import('../email-verification-form/email-verification-form.module');

    this.lazyLoadingService.getComponentAsync(EmailVerificationFormComponent, EmailVerificationFormModule, this.lazyLoadingService.container)
      .then((emailVerificationForm: EmailVerificationFormComponent) => {
        emailVerificationForm.email = this.form.get('email')?.value;
        this.spinnerService.show = false;
      });
  }


  checkDuplicateEmail(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> => {
      if (control.pristine) return of();

      return this.dataService.get('api/Account/CreateChangeEmailOTP',
        [
          {
            key: 'email',
            value: this.form.get('email')?.value
          }
        ],
        {
          authorization: true,
          showSpinner: true
        })
        .pipe(switchMap((result: any) => {
          // If it's not a duplicate email, open the email verification form
          if (!result) {
            this.fade();
            this.openEmailverificationForm();
            return of();
          } else {
            return of(result);
          }
        }));
    };
  }
}