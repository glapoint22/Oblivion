import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { AccountService, DataService, LazyLoadingService, SpinnerAction } from 'common';
import { Validation } from '../../classes/validation';
import { EmailVerificationFormComponent } from '../email-verification-form/email-verification-form.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'change-email-form',
  templateUrl: './change-email-form.component.html',
  styleUrls: ['./change-email-form.component.scss']
})
export class ChangeEmailFormComponent extends Validation implements OnInit {
  private dataServiceGetSubscription!: Subscription;
  private formStatusChangesSubscription!: Subscription;

  constructor
    (
      dataService: DataService,
      lazyLoadingService: LazyLoadingService,
      public accountService: AccountService
    ) {
    super(dataService, lazyLoadingService);
  }


  ngOnInit(): void {
    super.ngOnInit();
    this.form = new UntypedFormGroup({
      email: new UntypedFormControl(this.accountService.user?.email, {
        validators: [
          Validators.required,
          Validators.email
        ],
        updateOn: 'submit'
      })
    });

    this.formStatusChangesSubscription = this.form.statusChanges.subscribe((status: string) => {
      if (status == 'VALID') {
        this.dataServiceGetSubscription = this.dataService.get('api/Account/CreateChangeEmailOTP', [{
          key: 'email',
          value: this.form.get('email')?.value
        }], {
          spinnerAction: SpinnerAction.Start,
          authorization: true
        })
          .subscribe({
            complete: () => {
              this.fade();
              this.openEmailverificationForm();
            },
            error: (error: HttpErrorResponse) => {
              if (error.status == 409) {
                this.form.controls.email.setErrors({ duplicateEmail: true });
              }
            }
          });
      }
    });
  }


  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.setFocus(0);
  }





  async openEmailverificationForm() {
    this.fade();

    this.lazyLoadingService.load(async () => {
      const { EmailVerificationFormComponent } = await import('../email-verification-form/email-verification-form.component');
      const { EmailVerificationFormModule } = await import('../email-verification-form/email-verification-form.module');

      return {
        component: EmailVerificationFormComponent,
        module: EmailVerificationFormModule
      }
    }, SpinnerAction.End)
      .then((emailVerificationForm: EmailVerificationFormComponent) => {
        emailVerificationForm.email = this.form.get('email')?.value;
      });
  }



  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.dataServiceGetSubscription) this.dataServiceGetSubscription.unsubscribe();
    if (this.formStatusChangesSubscription) this.formStatusChangesSubscription.unsubscribe();
  }
}