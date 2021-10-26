import { Component } from '@angular/core';
import { ExternalLoginProvidersFormType } from '../../classes/enums';
import { Validation } from '../../classes/validation';


@Component({
  selector: 'create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrls: ['../../../scss/modal.scss', '../../../scss/forms.scss', './create-account-form.component.scss']
})
export class CreateAccountFormComponent extends Validation {
  


  onSubmit() {
    // if (this.form.valid) {
    //   console.log('Submitting!!!');
    // }
  }


  async onLogInClick(): Promise<void> {
    this.close();
    const { ExternalLoginProvidersFormComponent } = await import('../external-login-providers-form/external-login-providers-form.component');
    const componentRef = this.lazyLoadingService.createComponent(ExternalLoginProvidersFormComponent);
    const externalLoginProvidersForm = componentRef.instance;
    externalLoginProvidersForm.type = ExternalLoginProvidersFormType.LogIn;
  }
}
