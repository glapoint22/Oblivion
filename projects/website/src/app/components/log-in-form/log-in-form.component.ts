import { Component } from '@angular/core';
import { Validation } from '../../classes/validation';

@Component({
  selector: 'log-in-form',
  templateUrl: './log-in-form.component.html',
  styleUrls: [
    '../../../scss/forms.scss',
    '../../../scss/gold-buttons.scss',
    '../../../scss/horizontal-groove-line.scss',
    '../../../scss/purple-text.scss',
    '../../../scss/show-hide-password.scss',
    '../../../scss/or.scss',
    '../../../scss/footer.scss',
    '../../../scss/checkbox.scss',
    './log-in-form.component.scss'
  ]
})
export class LogInFormComponent extends Validation {

  onLogIn() {
    if (this.form.valid) {
      console.log('Submit');
    }
  }


  async onSignUpLinkClick() {
    this.close();
    const { SignUpFormModule } = await import('../sign-up-form/sign-up-form.module')
    const { SignUpFormComponent } = await import('../sign-up-form/sign-up-form.component');

    this.lazyLoadingService.getModuleRef(SignUpFormModule)
      .then(moduleRef => {
        const componentRef = this.lazyLoadingService.createComponent(SignUpFormComponent, 0, moduleRef.injector);
        componentRef.instance.viewRef = componentRef.hostView;
      });
  }
}