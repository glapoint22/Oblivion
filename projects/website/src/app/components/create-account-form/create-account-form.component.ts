import { Component, OnInit } from '@angular/core';
import { ExternalLoginProvidersFormType } from '../../classes/enums';
import { LazyLoading } from '../../classes/lazy-loading';

@Component({
  selector: 'create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrls: ['./create-account-form.component.scss']
})
export class CreateAccountFormComponent extends LazyLoading {

  

  
  async onLogInClick(): Promise<void> {
    this.remove();
    const { ExternalLoginProvidersFormComponent } = await import('../external-login-providers-form/external-login-providers-form.component');
    const externalLoginProvidersForm = this.lazyLoadingService.createComponent(ExternalLoginProvidersFormComponent)
    externalLoginProvidersForm.type = ExternalLoginProvidersFormType.LogIn;
  }
}
