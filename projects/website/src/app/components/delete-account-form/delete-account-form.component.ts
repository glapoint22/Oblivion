import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Validation } from '../../classes/validation';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
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
      private spinnerService: SpinnerService
    ) { super(dataService, lazyLoadingService) }


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


  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.tabElements) this.tabElements[0].nativeElement.focus();
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
    this.fade();
    const { SuccessPromptComponent } = await import('../success-prompt/success-prompt.component');
    const { SuccessPromptModule } = await import('../success-prompt/success-prompt.module');

    this.lazyLoadingService.getComponentAsync(SuccessPromptComponent, SuccessPromptModule, this.lazyLoadingService.container)
      .then((successPrompt: SuccessPromptComponent) => {
        successPrompt.header = 'Successful Account Deletion';
        successPrompt.message = 'Your account has been successfully deleted.';
        this.spinnerService.show = false;
      });
  }
}