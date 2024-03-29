import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { DataService, LazyLoadingService, SpinnerAction } from 'common';
import { Validation } from '../../classes/validation';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.scss']
})
export class ChangePasswordFormComponent extends Validation implements OnInit {
  private dataServicePutSubscription!: Subscription;
  private formStatusChangesSubscription!: Subscription;

  constructor
    (
      dataService: DataService,
      lazyLoadingService: LazyLoadingService,
    ) {
    super(dataService, lazyLoadingService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.form = new UntypedFormGroup({
      newPassword: new UntypedFormControl('', {
        validators: [
          Validators.required,
          this.invalidPasswordValidator()
        ],
        updateOn: 'submit'
      }),
      confirmPassword: new UntypedFormControl('', {
        validators: [
          Validators.required,
          this.invalidPasswordValidator()
        ],
        updateOn: 'submit'
      }),
      currentPassword: new UntypedFormControl('', {
        validators: [
          Validators.required,
          this.invalidPasswordValidator()
        ],
        updateOn: 'submit'
      })
    }, { validators: this.matchPasswordValidator });


    this.formStatusChangesSubscription = this.form.statusChanges.subscribe((status: string) => {
      if (status == 'VALID') {
        this.dataServicePutSubscription = this.dataService
          .put('api/Account/ChangePassword', {
            CurrentPassword: this.form.get('currentPassword')?.value,
            NewPassword: this.form.get('newPassword')?.value
          }, {
            authorization: true,
            spinnerAction: SpinnerAction.Start
          })
          .subscribe({
            complete: () => {
              this.fade();
              this.OpenSuccessPrompt();
            },
            error: (error: HttpErrorResponse) => {
              if (error.status == 400) {
                this.form.controls.currentPassword.setErrors({ incorrectPassword: true });
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
        successPrompt.header = 'Successful Password Change';
        successPrompt.message = 'Your password has been successfully changed.';
      });
  }



  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.dataServicePutSubscription) this.dataServicePutSubscription.unsubscribe();
    if (this.formStatusChangesSubscription) this.formStatusChangesSubscription.unsubscribe();
  }
}