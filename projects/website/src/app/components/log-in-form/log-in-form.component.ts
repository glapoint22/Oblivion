import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { invalidPasswordValidator, Validation } from '../../classes/validation';
import { AccountNotActivatedPromptComponent } from '../../components/account-not-activated-prompt/account-not-activated-prompt.component';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';

@Component({
  selector: 'log-in-form',
  templateUrl: './log-in-form.component.html',
  styleUrls: ['./log-in-form.component.scss']
})
export class LogInFormComponent extends Validation implements OnInit {
  public isPersistent: boolean = true;
  public noMatch!: boolean;

  constructor(
    private dataService: DataService,
    private accountService: AccountService,
    private lazyLoadingService: LazyLoadingService,
    private spinnerService: SpinnerService
  ) { super() }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        invalidPasswordValidator()
      ])
    });
  }



  onLogIn() {
    this.noMatch = false;
    if (this.form.valid) {
      this.dataService.post('api/Account/SignIn', {
        email: this.form.get('email')?.value,
        password: this.form.get('password')?.value,
        isPersistent: this.isPersistent
      }, {
        showSpinner: true
      }).subscribe((result: any) => {
        if (result) {
          if (result.notActivated) {
            this.openAccountNotActivatedPrompt();
          } else if (result.noMatch) {
            this.noMatch = true;
          }
        } else {
          this.accountService.setCustomer();
          this.accountService.refreshTokenSet = true;
          this.accountService.startRefreshTokenTimer();
          this.close();
        }


      })
    }
  }


  async onSignUpLinkClick() {
    this.spinnerService.show = true;
    this.close();
    const { SignUpFormComponent } = await import('../sign-up-form/sign-up-form.component');
    const { SignUpFormModule } = await import('../sign-up-form/sign-up-form.module')

    this.lazyLoadingService.getComponentAsync(SignUpFormComponent, SignUpFormModule, this.lazyLoadingService.container)
      .then(() => {
        this.spinnerService.show = false;
      });
  }


  async onForgotPasswordLinkClick() {
    this.spinnerService.show = true;
    this.close();
    const { ForgotPasswordFormComponent } = await import('../forgot-password-form/forgot-password-form.component');
    const { ForgotPasswordFormModule } = await import('../forgot-password-form/forgot-password-form.module');

    this.lazyLoadingService.getComponentAsync(ForgotPasswordFormComponent, ForgotPasswordFormModule, this.lazyLoadingService.container)
      .then(() => {
        this.spinnerService.show = false;
      });
  }


  async openAccountNotActivatedPrompt() {
    this.spinnerService.show = true;
    this.close();
    const { AccountNotActivatedPromptComponent } = await import('../../components/account-not-activated-prompt/account-not-activated-prompt.component');
    const { AccountNotActivatedPromptModule } = await import('../../components/account-not-activated-prompt/account-not-activated-prompt.module');

    this.lazyLoadingService.getComponentAsync(AccountNotActivatedPromptComponent, AccountNotActivatedPromptModule, this.lazyLoadingService.container)
      .then((accountNotActivatedPrompt: AccountNotActivatedPromptComponent) => {
        accountNotActivatedPrompt.email = this.form.get('email')?.value;
        this.spinnerService.show = false;
      });
  }
}