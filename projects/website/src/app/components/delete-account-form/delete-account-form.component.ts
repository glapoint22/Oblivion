import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService, LazyLoadingService, SpinnerAction } from 'common';
import { Validation } from '../../classes/validation';
import { AccountService } from '../../services/account/account.service';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';


@Component({
  selector: 'delete-account-form',
  templateUrl: './delete-account-form.component.html',
  styleUrls: ['./delete-account-form.component.scss']
})
export class DeleteAccountFormComponent extends Validation implements OnInit {
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

    this.email = this.accountService.user?.email!;

    this.form = new FormGroup({
      otp: new FormControl('', {
        validators: Validators.required,
        asyncValidators: this.validateOneTimePasswordAsync('api/Account/ValidateDeleteAccountOneTimePassword'),
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
        this.dataService.put('api/Account/DeleteAccount', {
          password: this.form.get('password')?.value,
          oneTimePassword: this.form.get('otp')?.value
        },
          {
            authorization: true,
            spinnerAction: SpinnerAction.Start
          }
        ).subscribe(() => {
          this.fade();
          this.accountService.logOut();
          this.OpenSuccessPrompt();
        });
      }
    });
  }


  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.setFocus(0);
  }


  onSubmit() {
    this.emailResent = false;
  }


  onResendEmailClick() {
    this.dataService.post('api/Account/CreateDeleteAccountOTP', undefined,
      {
        spinnerAction: SpinnerAction.StartEnd,
        authorization: true
      }
    ).subscribe(() => {
      this.emailResent = true;
    });
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
        successPrompt.header = 'Successful Account Deletion';
        successPrompt.message = 'Your account has been successfully deleted.';
      });
  }
}