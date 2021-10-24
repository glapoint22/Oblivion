import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ExternalLoginProvidersFormType } from './classes/enums';
import { LazyLoadingService } from './services/lazy-loading/lazy-loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private container: ViewContainerRef, private lazyLoadingService: LazyLoadingService) { }


  ngOnInit(): void {
    this.lazyLoadingService.container = this.container;
  }





  async openSignUpForm(): Promise<void> {
    const { ExternalLoginProvidersFormComponent } = await import('./components/external-login-providers-form/external-login-providers-form.component');
    const externalLoginProvidersForm = this.lazyLoadingService.createComponent(ExternalLoginProvidersFormComponent)
    externalLoginProvidersForm.type = ExternalLoginProvidersFormType.SignUp;
  }

  async openLogInForm(): Promise<void> {
    const { ExternalLoginProvidersFormComponent } = await import('./components/external-login-providers-form/external-login-providers-form.component');
    const externalLoginProvidersForm = this.lazyLoadingService.createComponent(ExternalLoginProvidersFormComponent)
    externalLoginProvidersForm.type = ExternalLoginProvidersFormType.LogIn;
  }


  async openCreateAccountForm(): Promise<void> {
    const { CreateAccountFormComponent } = await import('./components/create-account-form/create-account-form.component');
    this.lazyLoadingService.createComponent(CreateAccountFormComponent)
  }

}