import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoad } from '../../classes/lazy-load';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
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
      private spinnerService: SpinnerService,
      private router: Router
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
    this.spinnerService.show = true;
    const { CreateAccountFormComponent } = await import('../create-account-form/create-account-form.component');
    const { CreateAccountFormModule } = await import('../create-account-form/create-account-form.module');

    this.lazyLoadingService.getComponentAsync(CreateAccountFormComponent, CreateAccountFormModule, this.lazyLoadingService.container)
      .then(() => {
        this.spinnerService.show = false;
      });
  }


  async onLogInLinkClick() {
    this.fade();
    this.spinnerService.show = true;
    const { LogInFormComponent } = await import('../log-in-form/log-in-form.component');
    const { LogInFormModule } = await import('../log-in-form/log-in-form.module')

    this.lazyLoadingService.getComponentAsync(LogInFormComponent, LogInFormModule, this.lazyLoadingService.container)
      .then(() => {
        this.spinnerService.show = false;
      });
  }


  onEnter(e: KeyboardEvent): void {
    if (this.tabElements && this.tabElements[0].nativeElement == document.activeElement) this.externalLoginProvidersComponent.signInWithGoogle();
    if (this.tabElements && this.tabElements[1].nativeElement == document.activeElement) this.externalLoginProvidersComponent.signInWithFacebook();
    if (this.tabElements && this.tabElements[2].nativeElement == document.activeElement) this.externalLoginProvidersComponent.signInWithMicrosoft();
    if (this.tabElements && this.tabElements[3].nativeElement == document.activeElement) this.externalLoginProvidersComponent.signInWithAmazon();
    if (this.tabElements && this.tabElements[5].nativeElement == document.activeElement) this.onLogInLinkClick();
  }
}