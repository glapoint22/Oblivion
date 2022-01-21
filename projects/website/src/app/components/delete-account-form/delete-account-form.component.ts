import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Authentication } from '../../classes/authentication';
import { invalidPasswordValidator, Validation } from '../../classes/validation';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';


@Component({
  selector: 'delete-account-form',
  templateUrl: './delete-account-form.component.html',
  styleUrls: ['./delete-account-form.component.scss']
})
export class DeleteAccountFormComponent extends Validation {
  constructor(private lazyLoadingService: LazyLoadingService, private dataService: DataService, private accountService: AccountService, private router: Router) { super() }

  public email!: string;
  public authentication: Authentication = new Authentication();

  @ViewChild('otpInput') otpInput!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;
  @ViewChild('verificationForm') verificationForm!: ElementRef<HTMLFormElement>;


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
        successPromptComponent.header = 'Successful Account Deletion';
        successPromptComponent.message = 'Your account has been successfully deleted.';
      });
  }


  onSubmit() {
    if (this.form.valid) {
      this.dataService.put<Authentication>('api/Account/DeleteAccount', {
        password: this.form.get('password')?.value,
        oneTimePassword: this.form.get('otp')?.value
      },
        true
      ).subscribe((authentication: Authentication) => {
        this.authentication.failure = authentication.failure;

        if (!this.authentication.failure) {
          this.close();
          this.router.navigate(['home']);
          this.accountService.logOut();
          this.OpenSuccessPrompt();
        }
      });
    }
  }
}