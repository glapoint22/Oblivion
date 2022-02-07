import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { Validation } from '../../classes/validation';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
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
  public externalLoginProviders!: Array<ElementRef<HTMLElement>>
  @ViewChild('externalLoginProvidersComponent') externalLoginProvidersComponent!: ExternalLoginProvidersComponent;

  constructor(
    dataService: DataService,
    lazyLoadingService: LazyLoadingService,
    public accountService: AccountService,
    private spinnerService: SpinnerService
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
        asyncValidators: this.checkEmailPasswordAsync(),
        updateOn: 'submit'
      })
    });

    this.form.statusChanges.subscribe((status: string) => {
      if (status == 'VALID') {
        this.dataService.post('api/Account/LogIn', {
          email: this.form.get('email')?.value,
          password: this.form.get('password')?.value,
          isPersistent: this.isPersistent
        }, {
          showSpinner: true
        }).subscribe((error: any) => {
          if (!error) {
            this.setLogIn();
          } else {
            this.openAccountNotActivatedForm();
          }
        });
      }
    });
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


  async openAccountNotActivatedForm() {
    this.spinnerService.show = true;
    this.fade();
    const { AccountNotActivatedFormComponent } = await import('../account-not-activated-form/account-not-activated-form.component');
    const { AccountNotActivatedFormModule } = await import('../account-not-activated-form/account-not-activated-form.module');

    this.lazyLoadingService.getComponentAsync(AccountNotActivatedFormComponent, AccountNotActivatedFormModule, this.lazyLoadingService.container)
      .then((accountNotActivatedPrompt: AccountNotActivatedFormComponent) => {
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


  checkEmailPasswordAsync(): AsyncValidatorFn {
    return (): Observable<ValidationErrors> => {
      return this.dataService.post('api/Account/ValidateEmailPassword',
        {
          email: this.form.get('email')?.value,
          password: this.form.get('password')?.value
        }, {
        showSpinner: true
      });
    };
  }
}