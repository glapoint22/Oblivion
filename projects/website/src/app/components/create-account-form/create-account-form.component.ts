import { Component } from '@angular/core';
import { ExternalLoginProvidersFormType } from '../../classes/enums';
import { Validation } from '../../classes/validation';


@Component({
  selector: 'create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrls: [
    '../../../scss/forms.scss',
    '../../../scss/gold-buttons.scss',
    '../../../scss/horizontal-groove-line.scss',
    '../../../scss/purple-text.scss',
    '../../../scss/show-hide-password.scss',
    '../../../scss/lithos-pro.scss',
    '../../../scss/info-icon.scss',
    './create-account-form.component.scss'
  ]
})
export class CreateAccountFormComponent extends Validation {
  
  


  onSubmit() {
    if (this.form.valid) {
      console.log('Submit');
    }
  }


  async onLogInClick(): Promise<void> {
    this.close();
    const { ExternalLoginProvidersFormComponent } = await import('../external-login-providers-form/external-login-providers-form.component');
    const componentRef = this.lazyLoadingService.createComponent(ExternalLoginProvidersFormComponent);
    const externalLoginProvidersForm = componentRef.instance;
    externalLoginProvidersForm.type = ExternalLoginProvidersFormType.LogIn;
  }
}