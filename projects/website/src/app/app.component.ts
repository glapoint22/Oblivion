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
    const componentRef = this.lazyLoadingService.createComponent(ExternalLoginProvidersFormComponent);
    componentRef.instance.type = ExternalLoginProvidersFormType.SignUp;
    componentRef.instance.viewRef = componentRef.hostView;
  }

  async openLogInForm(): Promise<void> {
    const { ExternalLoginProvidersFormComponent } = await import('./components/external-login-providers-form/external-login-providers-form.component');
    const componentRef = this.lazyLoadingService.createComponent(ExternalLoginProvidersFormComponent);
    const externalLoginProvidersForm = componentRef.instance;
    componentRef.instance.type = ExternalLoginProvidersFormType.LogIn;
    componentRef.instance.viewRef = componentRef.hostView;
  }


  async openCreateAccountForm(): Promise<void> {
    const { CreateAccountFormComponent } = await import('./components/create-account-form/create-account-form.component');
    const { CreateAccountFormModule } = await import('./components/create-account-form/create-account-form.module');

    this.lazyLoadingService.getModuleRef(CreateAccountFormModule)
      .then(moduleRef => {
        const componentRef = this.lazyLoadingService.createComponent(CreateAccountFormComponent, 0, moduleRef.injector);
        componentRef.instance.viewRef = componentRef.hostView;
      })


  }

}