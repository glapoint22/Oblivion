import { Component } from '@angular/core';
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
    '../../../scss/footer.scss',
    './create-account-form.component.scss'
  ]
})
export class CreateAccountFormComponent extends Validation {
  
  
  onSubmit() {
    if (this.form.valid) {
      console.log('Submit');
    }
  }


  async onLogInLinkClick() {
    this.close();
    const { LogInFormModule } = await import('../log-in-form/log-in-form.module')
    const { LogInFormComponent } = await import('../log-in-form/log-in-form.component');

    this.lazyLoadingService.getModuleRef(LogInFormModule)
      .then(moduleRef => {
        const componentRef = this.lazyLoadingService.createComponent(LogInFormComponent, 0, moduleRef.injector);
        componentRef.instance.viewRef = componentRef.hostView;
      });
  }
}