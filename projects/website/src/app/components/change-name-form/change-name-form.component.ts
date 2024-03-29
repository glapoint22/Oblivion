import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { AccountService, DataService, LazyLoadingService, SpinnerAction } from 'common';
import { Validation } from '../../classes/validation';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'change-name-form',
  templateUrl: './change-name-form.component.html',
  styleUrls: ['./change-name-form.component.scss']
})
export class ChangeNameFormComponent extends Validation implements OnInit {
  private dataServicePutSubscription!: Subscription;

  constructor
    (
      dataService: DataService,
      lazyLoadingService: LazyLoadingService,
      public accountService: AccountService,
  ) { super(dataService, lazyLoadingService) }


  ngOnInit(): void {
    super.ngOnInit();
    this.form = new UntypedFormGroup({
      firstName: new UntypedFormControl(this.accountService.user?.firstName, {
        validators: [
          Validators.required,
          this.invalidNameValidator(),
          Validators.maxLength(40)
        ],
        updateOn: 'submit'
      }),
      lastName: new UntypedFormControl(this.accountService.user?.lastName, {
        validators: [
          Validators.required,
          this.invalidNameValidator(),
          Validators.maxLength(40)
        ],
        updateOn: 'submit'
      })
    });
  }


  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.setFocus(0);
  }


  onSubmit() {
    if (this.form.valid) {
      this.dataServicePutSubscription = this.dataService.put('api/Account/ChangeName', {
        firstName: this.form.get('firstName')?.value,
        lastName: this.form.get('lastName')?.value
      },
        {
          authorization: true,
          spinnerAction: SpinnerAction.Start
        }
      ).subscribe(() => {
        this.accountService.setUser();
        this.openSuccessPrompt();
      });
    }
  }


  async openSuccessPrompt() {
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
        successPrompt.header = 'Successful Name Change';
        successPrompt.message = 'Your name has been successfully changed.';
      });
  }



  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.dataServicePutSubscription) this.dataServicePutSubscription.unsubscribe();
  }
}