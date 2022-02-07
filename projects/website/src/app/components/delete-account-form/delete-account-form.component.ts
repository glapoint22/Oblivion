import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Validation } from '../../classes/validation';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { DeleteAccountPromptComponent } from '../delete-account-prompt/delete-account-prompt.component';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';


@Component({
  selector: 'delete-account-form',
  templateUrl: './delete-account-form.component.html',
  styleUrls: ['./delete-account-form.component.scss']
})
export class DeleteAccountFormComponent extends Validation implements OnInit {
  public email!: string;
  public deleteAccountPrompt!: DeleteAccountPromptComponent;
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

    this.email = this.accountService.customer?.email!;

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
            showSpinner: true
          }
        ).subscribe(() => {
          this.fade();
          this.accountService.logOut();
          this.OpenSuccessPrompt();
        });
      }
    });
  }


  onSubmit() {
    this.emailResent = false;
  }


  onResendEmailClick() {
    this.dataService.post('api/Account/CreateDeleteAccountOTP', undefined,
      {
        showSpinner: true,
        authorization: true
      }
    ).subscribe(() => {
      this.emailResent = true;
    });
  }


  async OpenSuccessPrompt() {
    document.removeEventListener("keydown", this.keyDown);
    const { SuccessPromptComponent } = await import('../success-prompt/success-prompt.component');
    const { SuccessPromptModule } = await import('../success-prompt/success-prompt.module');

    this.lazyLoadingService.getComponentAsync(SuccessPromptComponent, SuccessPromptModule, this.lazyLoadingService.container)
      .then((successPrompt: SuccessPromptComponent) => {
        successPrompt.header = 'Successful Account Deletion';
        successPrompt.message = 'Your account has been successfully deleted.';
        successPrompt.deleteAccountForm = this;
        this.spinnerService.show = false;
      });
  }


  close() {
    super.close();
    if (this.deleteAccountPrompt) this.deleteAccountPrompt.close();
  }
}