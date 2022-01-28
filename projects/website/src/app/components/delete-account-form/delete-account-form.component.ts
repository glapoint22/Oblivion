import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Authentication } from '../../classes/authentication';
import { invalidPasswordValidator, Validation } from '../../classes/validation';
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
  public authentication: Authentication = new Authentication();
  public deleteAccountPrompt!: DeleteAccountPromptComponent;

  @ViewChild('otpInput') otpInput!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;
  @ViewChild('verificationForm') verificationForm!: ElementRef<HTMLFormElement>;

  constructor
    (
      private lazyLoadingService: LazyLoadingService,
      private dataService: DataService,
      private accountService: AccountService,
      private spinnerService: SpinnerService,
      private router: Router
    ) { super() }


  ngOnInit(): void {
    super.ngOnInit();
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


  onSubmit() {
    if (this.form.valid) {
      this.spinnerService.show = true;
      this.dataService.put<Authentication>('api/Account/DeleteAccount', {
        password: this.form.get('password')?.value,
        oneTimePassword: this.form.get('otp')?.value
      },
        { authorization: true }
      ).subscribe((authentication: Authentication) => {
        this.authentication.failure = authentication.failure;

        if (!this.authentication.failure) {
          this.fade();
          this.router.navigate(['home']);
          this.accountService.logOut();
          this.OpenSuccessPrompt();
        }
      });
    }
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