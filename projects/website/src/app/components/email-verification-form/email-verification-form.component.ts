import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Authentication } from '../../classes/authentication';
import { invalidPasswordValidator, Validation } from '../../classes/validation';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { ChangeEmailFormComponent } from '../change-email-form/change-email-form.component';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';

@Component({
  selector: 'email-verification-form',
  templateUrl: './email-verification-form.component.html',
  styleUrls: ['./email-verification-form.component.scss']
})
export class EmailVerificationFormComponent extends Validation implements OnInit {
  @ViewChild('otpInput') otpInput!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;
  @ViewChild('verificationForm') verificationForm!: ElementRef<HTMLFormElement>;
  public email!: string;
  public authentication: Authentication = new Authentication();
  public changeEmailForm!: ChangeEmailFormComponent;

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
  }



  ngAfterViewInit() {
    super.ngAfterViewInit();

    this.otpInput.nativeElement.setAttribute('autocomplete', 'off');
    this.verificationForm.nativeElement.setAttribute('autocomplete', 'off');
    this.passwordInput.nativeElement.setAttribute('autocomplete', 'off');
  }


  onSubmit() {
    if (this.form.valid) {
      this.spinnerService.show = true;
      this.dataService.put<Authentication>('api/Account/ChangeEmail', {
        email: this.email,
        password: this.form.get('password')?.value,
        oneTimePassword: this.form.get('otp')?.value
      },
        { authorization: true }
      ).subscribe((authentication: Authentication) => {
        this.authentication.failure = authentication.failure;

        if (!this.authentication.failure) {
          this.accountService.setCustomer();
          this.fade();
          this.OpenSuccessPrompt();
        }
      });
    }
  }


  async OpenSuccessPrompt() {
    const { SuccessPromptComponent } = await import('../success-prompt/success-prompt.component');
    const { SuccessPromptModule } = await import('../success-prompt/success-prompt.module');

    this.lazyLoadingService.getComponentAsync(SuccessPromptComponent, SuccessPromptModule, this.lazyLoadingService.container)
      .then((successPrompt: SuccessPromptComponent) => {
        successPrompt.header = 'Successful Email Change';
        successPrompt.message = 'Your email has been successfully changed.';
        successPrompt.emailVerificationForm = this;
        this.spinnerService.show = false;
      });
  }


  close() {
    super.close();
    this.changeEmailForm.close();
  }
}