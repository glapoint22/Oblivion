import { Component, OnInit, ViewContainerRef } from '@angular/core';
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
    const { SignUpFormModule } = await import('./components/sign-up-form/sign-up-form.module');
    const { SignUpFormComponent } = await import('./components/sign-up-form/sign-up-form.component');

    this.lazyLoadingService.getModuleRef(SignUpFormModule)
      .then(moduleRef => {
        const componentRef = this.lazyLoadingService.createComponent(SignUpFormComponent, 0, moduleRef.injector);
        componentRef.instance.viewRef = componentRef.hostView;
      });
  }

  
  async openLogInForm(): Promise<void> {
    const { LogInFormModule } = await import('./components/log-in-form/log-in-form.module');
    const { LogInFormComponent } = await import('./components/log-in-form/log-in-form.component');

    this.lazyLoadingService.getModuleRef(LogInFormModule)
      .then(moduleRef => {
        const componentRef = this.lazyLoadingService.createComponent(LogInFormComponent, 0, moduleRef.injector);
        componentRef.instance.viewRef = componentRef.hostView;
      });
  }


  async openCreateAccountForm(): Promise<void> {
    const { CreateAccountFormComponent } = await import('./components/create-account-form/create-account-form.component');
    const { CreateAccountFormModule } = await import('./components/create-account-form/create-account-form.module');

    this.lazyLoadingService.getModuleRef(CreateAccountFormModule)
      .then(moduleRef => {
        const componentRef = this.lazyLoadingService.createComponent(CreateAccountFormComponent, 0, moduleRef.injector);
        componentRef.instance.viewRef = componentRef.hostView;
      });


  }

}