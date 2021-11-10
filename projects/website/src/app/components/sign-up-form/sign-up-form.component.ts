import { Component } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { CreateAccountFormComponent } from '../create-account-form/create-account-form.component';
import { LogInFormComponent } from '../log-in-form/log-in-form.component';

@Component({
  selector: 'sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.scss']
})
export class SignUpFormComponent extends LazyLoad {

  constructor(private lazyLoadingService: LazyLoadingService) { super() }


  async onCreateAccountButtonClick(): Promise<void> {
    this.close();
    const { CreateAccountFormComponent } = await import('../create-account-form/create-account-form.component');
    const { CreateAccountFormModule } = await import('../create-account-form/create-account-form.module');

    this.lazyLoadingService.getComponentAsync(CreateAccountFormComponent, CreateAccountFormModule, this.lazyLoadingService.container);
  }


  async onLogInLinkClick() {
    this.close();
    const { LogInFormComponent } = await import('../log-in-form/log-in-form.component');
    const { LogInFormModule } = await import('../log-in-form/log-in-form.module')

    this.lazyLoadingService.getComponentAsync(LogInFormComponent, LogInFormModule, this.lazyLoadingService.container);
  }
}