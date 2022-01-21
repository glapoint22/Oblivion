import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { invalidPasswordValidator, Validation } from '../../classes/validation';
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
export class DeleteAccountFormComponent extends Validation {
  @ViewChild('otpInput') otpInput!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;
  @ViewChild('verificationForm') verificationForm!: ElementRef<HTMLFormElement>;
  public email!: string;

  constructor
    (
      private lazyLoadingService: LazyLoadingService,
      private dataService: DataService,
      private accountService: AccountService,
      private spinnerService: SpinnerService
    ) { super() }

  ngOnInit(): void {
    this.form = new FormGroup({
      otp: new FormControl('', [
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.required,
        invalidPasswordValidator()
      ])
    });


    this.email = this.accountService.customer?.email!;
  }


  ngAfterViewInit() {
    super.ngAfterViewInit();

    this.otpInput.nativeElement.setAttribute('autocomplete', 'off');
    this.verificationForm.nativeElement.setAttribute('autocomplete', 'off');
    this.passwordInput.nativeElement.setAttribute('autocomplete', 'off');
  }


  async OpenSuccessPrompt() {
    const { SuccessPromptComponent } = await import('../success-prompt/success-prompt.component');
    const { SuccessPromptModule } = await import('../success-prompt/success-prompt.module');

    this.lazyLoadingService.getComponentAsync(SuccessPromptComponent, SuccessPromptModule, this.lazyLoadingService.container)
      .then((successPromptComponent: SuccessPromptComponent) => {
        successPromptComponent.header = 'Successful Email Change';
        successPromptComponent.message = 'Your email has been successfully changed.';
        this.spinnerService.show = false;
      });
  }


  onSubmit() {
    if (this.form.valid) {
      this.spinnerService.show = true;
      this.dataService.put('api/Account/DeleteAccount', {
        email: this.email,
        password: this.form.get('password')?.value,
        token: this.form.get('otp')?.value
      },
        { authorization: true }
      ).subscribe(() => {
        this.accountService.setCustomer();
        this.close();
        this.OpenSuccessPrompt();
      });
    }
  }
}