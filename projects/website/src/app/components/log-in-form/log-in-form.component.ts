import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { invalidPasswordValidator, Validation } from '../../classes/validation';
import { AccountNotActivatedPromptComponent } from '../../components/account-not-activated-prompt/account-not-activated-prompt.component';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { ExternalLoginProvidersComponent } from '../external-login-providers/external-login-providers.component';

@Component({
  selector: 'log-in-form',
  templateUrl: './log-in-form.component.html',
  styleUrls: ['./log-in-form.component.scss']
})
export class LogInFormComponent extends Validation implements OnInit {
  public isPersistent: boolean = true;
  public noMatch!: boolean;
  public returnUrl!: string;
  public onRedirect = new Subject<void>();
  public checkbox!: HTMLInputElement;
  public externalLoginProviders!: Array<ElementRef<HTMLElement>>
  @ViewChild('externalLoginProvidersComponent') externalLoginProvidersComponent!: ExternalLoginProvidersComponent;

  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private dataService: DataService,
      private accountService: AccountService,
      private spinnerService: SpinnerService,
      private router: Router
    ) { super(lazyLoadingService) }


  ngOnInit(): void {
    super.ngOnInit();
    this.setForm();
  }


  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    if (this.base && this.tabElements) {
      this.base.nativeElement.focus();
      this.tabElements = this.externalLoginProviders;
      this.tabElements = this.tabElements.concat(this.HTMLElements.toArray());
    }
  }


  setForm() {
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

          if (this.onRedirect.observed) {
            this.fade();
            this.onRedirect.next();

          } else {
            this.close();
          }

          if (this.returnUrl) {
            this.router.navigateByUrl(this.returnUrl);
          }
        }
      })
    }
  }


  async onSignUpLinkClick() {
    this.fade();
    this.spinnerService.show = true;
    const { SignUpFormComponent } = await import('../sign-up-form/sign-up-form.component');
    const { SignUpFormModule } = await import('../sign-up-form/sign-up-form.module')

    this.lazyLoadingService.getComponentAsync(SignUpFormComponent, SignUpFormModule, this.lazyLoadingService.container)
      .then(() => {
        this.spinnerService.show = false;
      });
  }


  async onForgotPasswordLinkClick() {
    this.fade();
    this.spinnerService.show = true;
    const { ForgotPasswordFormComponent } = await import('../forgot-password-form/forgot-password-form.component');
    const { ForgotPasswordFormModule } = await import('../forgot-password-form/forgot-password-form.module');

    this.lazyLoadingService.getComponentAsync(ForgotPasswordFormComponent, ForgotPasswordFormModule, this.lazyLoadingService.container)
      .then(() => {
        this.spinnerService.show = false;
      });
  }


  async openAccountNotActivatedPrompt() {
    this.fade();
    this.spinnerService.show = true;
    const { AccountNotActivatedPromptComponent } = await import('../../components/account-not-activated-prompt/account-not-activated-prompt.component');
    const { AccountNotActivatedPromptModule } = await import('../../components/account-not-activated-prompt/account-not-activated-prompt.module');

    this.lazyLoadingService.getComponentAsync(AccountNotActivatedPromptComponent, AccountNotActivatedPromptModule, this.lazyLoadingService.container)
      .then((accountNotActivatedPrompt: AccountNotActivatedPromptComponent) => {
        accountNotActivatedPrompt.email = this.form.get('email')?.value;
        this.spinnerService.show = false;
      });
  }


  onSpace(e: KeyboardEvent): void {
    e.preventDefault();

    if (this.tabElements) {
      if (this.tabElements[6].nativeElement == document.activeElement) {
        this.isPersistent = !this.isPersistent;
      }
    }
  }


  onEnter(e: KeyboardEvent): void {
    if (this.tabElements) {
      if (this.tabElements && this.tabElements[0].nativeElement == document.activeElement) this.externalLoginProvidersComponent.signInWithGoogle();
      if (this.tabElements && this.tabElements[1].nativeElement == document.activeElement) this.externalLoginProvidersComponent.signInWithFacebook();
      if (this.tabElements && this.tabElements[2].nativeElement == document.activeElement) this.externalLoginProvidersComponent.signInWithMicrosoft();
      if (this.tabElements && this.tabElements[3].nativeElement == document.activeElement) this.externalLoginProvidersComponent.signInWithAmazon();
      if (this.tabElements[7].nativeElement == document.activeElement) this.onForgotPasswordLinkClick()
      if (this.tabElements[9].nativeElement == document.activeElement) this.onSignUpLinkClick();
    }
  }
}