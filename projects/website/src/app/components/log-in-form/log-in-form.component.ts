import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService, DataService, LazyLoadingService, SpinnerAction } from 'common';
import { Validation } from '../../classes/validation';
import { AccountNotActivatedFormComponent } from '../account-not-activated-form/account-not-activated-form.component';
import { ExternalLoginProvidersComponent } from '../external-login-providers/external-login-providers.component';

@Component({
  selector: 'log-in-form',
  templateUrl: './log-in-form.component.html',
  styleUrls: ['./log-in-form.component.scss']
})
export class LogInFormComponent extends Validation implements OnInit {
  public isPersistent: boolean = true;
  public checkbox!: HTMLInputElement;
  public externalLoginProviders!: Array<ElementRef<HTMLElement>>;
  @ViewChild('externalLoginProvidersComponent') externalLoginProvidersComponent!: ExternalLoginProvidersComponent;

  constructor(
    dataService: DataService,
    lazyLoadingService: LazyLoadingService,
    public accountService: AccountService
  ) { super(dataService, lazyLoadingService) }


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
      email: new FormControl('', {
        validators: [
          Validators.required,
          Validators.email
        ],
        updateOn: 'submit'
      }),
      password: new FormControl('', {
        validators: [
          Validators.required,
          this.invalidPasswordValidator()
        ],
        updateOn: 'submit'
      })
    });
  }


  onSubmit() {
    if (this.form.valid) {

      this.dataService.post('api/Account/LogIn', {
        email: this.form.get('email')?.value,
        password: this.form.get('password')?.value,
        isPersistent: this.isPersistent
      }, {
        spinnerAction: SpinnerAction.StartEnd
      })
        .subscribe({
          complete: () => {
            this.setLogIn();
          },
          error: (error: HttpErrorResponse) => {
            if (error.status == 401) {
              this.form.controls.email.setErrors({ noMatch: true });
            } else if (error.status == 409) {
              this.openAccountNotActivatedForm();
            }
          }
        });
    }

  }


  setLogIn() {
    this.accountService.logIn();

    if (this.accountService.onRedirect.observed) {
      this.fade();
      this.accountService.onRedirect.next();

    } else {
      this.close();
    }
  }


  async onSignUpLinkClick() {
    this.fade();

    this.lazyLoadingService.load(async () => {
      const { SignUpFormComponent } = await import('../sign-up-form/sign-up-form.component');
      const { SignUpFormModule } = await import('../sign-up-form/sign-up-form.module');

      return {
        component: SignUpFormComponent,
        module: SignUpFormModule
      }
    }, SpinnerAction.StartEnd);

  }


  async onForgotPasswordLinkClick() {
    this.fade();

    this.lazyLoadingService.load(async () => {
      const { ForgotPasswordFormComponent } = await import('../forgot-password-form/forgot-password-form.component');
      const { ForgotPasswordFormModule } = await import('../forgot-password-form/forgot-password-form.module');

      return {
        component: ForgotPasswordFormComponent,
        module: ForgotPasswordFormModule
      }
    }, SpinnerAction.StartEnd);

  }


  async openAccountNotActivatedForm() {
    this.fade();

    this.lazyLoadingService.load(async () => {
      const { AccountNotActivatedFormComponent } = await import('../account-not-activated-form/account-not-activated-form.component');
      const { AccountNotActivatedFormModule } = await import('../account-not-activated-form/account-not-activated-form.module');

      return {
        component: AccountNotActivatedFormComponent,
        module: AccountNotActivatedFormModule
      }
    }, SpinnerAction.StartEnd)
      .then((accountNotActivatedPrompt: AccountNotActivatedFormComponent) => {
        accountNotActivatedPrompt.email = this.form.get('email')?.value;
      });
  }


  onSpace(e: KeyboardEvent): void {
    if (this.tabElements) {
      if (this.tabElements[6].nativeElement == document.activeElement) {
        this.isPersistent = !this.isPersistent;
      }
    }
  }


  onEnter(e: KeyboardEvent): void {
    if (this.tabElements) {
      if (this.tabElements[0].nativeElement == document.activeElement) this.externalLoginProvidersComponent.signInWithGoogle();
      if (this.tabElements[1].nativeElement == document.activeElement) this.externalLoginProvidersComponent.signInWithFacebook();
      if (this.tabElements[2].nativeElement == document.activeElement) this.externalLoginProvidersComponent.signInWithMicrosoft();
      if (this.tabElements[3].nativeElement == document.activeElement) this.externalLoginProvidersComponent.signInWithAmazon();

      if ((this.tabElements[4].nativeElement as HTMLInputElement).value.length > 0 &&
        this.tabElements[4].nativeElement != document.activeElement &&
        (this.tabElements[5].nativeElement as HTMLInputElement).value.length > 0) {
        this.tabElements[5].nativeElement != document.activeElement &&
          this.tabElements[8].nativeElement.focus();
      }

      if (this.tabElements[7].nativeElement == document.activeElement) this.onForgotPasswordLinkClick()
      if (this.tabElements[9].nativeElement == document.activeElement) this.onSignUpLinkClick();
    }
  }
}