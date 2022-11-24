import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { AccountService } from '../../services/account/account.service';
import { ExternalLoginProvidersComponent } from '../external-login-providers/external-login-providers.component';

@Component({
  selector: 'sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.scss']
})
export class SignUpFormComponent extends LazyLoad implements OnInit {
  public isLoginPage!: boolean;
  public externalLoginProviders!: Array<ElementRef<HTMLElement>>
  @ViewChild('externalLoginProvidersComponent') externalLoginProvidersComponent!: ExternalLoginProvidersComponent;

  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private router: Router,
      private accountService: AccountService
    ) { super(lazyLoadingService) }




  ngOnInit(): void {
    super.ngOnInit();
    this.isLoginPage = this.router.url.includes('log-in');
  }


  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.base.nativeElement.focus();
    this.tabElements = this.externalLoginProviders;
    this.tabElements = this.tabElements.concat(this.HTMLElements.toArray());
  }





  async onCreateAccountButtonClick() {
    this.fade();

    this.lazyLoadingService.load(async () => {
      const { CreateAccountFormComponent } = await import('../create-account-form/create-account-form.component');
      const { CreateAccountFormModule } = await import('../create-account-form/create-account-form.module');

      return {
        component: CreateAccountFormComponent,
        module: CreateAccountFormModule
      }
    }, SpinnerAction.StartEnd);
  }


  async onLogInLinkClick() {
    this.fade();

    this.lazyLoadingService.load(async () => {
      const { LogInFormComponent } = await import('../log-in-form/log-in-form.component');
      const { LogInFormModule } = await import('../log-in-form/log-in-form.module');

      return {
        component: LogInFormComponent,
        module: LogInFormModule
      }
    }, SpinnerAction.StartEnd);
  }


  onEnter(e: KeyboardEvent): void {
    if (this.tabElements && this.tabElements[0].nativeElement == document.activeElement) this.externalLoginProvidersComponent.signInWithGoogle();
    if (this.tabElements && this.tabElements[1].nativeElement == document.activeElement) this.externalLoginProvidersComponent.signInWithFacebook();
    if (this.tabElements && this.tabElements[2].nativeElement == document.activeElement) this.externalLoginProvidersComponent.signInWithMicrosoft();
    if (this.tabElements && this.tabElements[3].nativeElement == document.activeElement) this.externalLoginProvidersComponent.signInWithAmazon();
    if (this.tabElements && this.tabElements[5].nativeElement == document.activeElement) this.onLogInLinkClick();
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


  onSpace(e: KeyboardEvent): void {
    e.preventDefault();
  }
}