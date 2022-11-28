import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService, DataService, LazyLoadingService, SpinnerAction } from 'common';
import { Validation } from '../../classes/validation';
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
      public accountService: AccountService
    ) {
    super(dataService, lazyLoadingService);
  }


  ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup({
      email: new FormControl(this.accountService.user?.email, {
        validators: [
          Validators.required,
          Validators.email
        ],
        updateOn: 'submit'
      })
    });

    this.form.statusChanges.subscribe((status: string) => {
      if (status == 'VALID') {
        this.dataService.get('api/Account/CreateChangeEmailOTP', [{
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
}