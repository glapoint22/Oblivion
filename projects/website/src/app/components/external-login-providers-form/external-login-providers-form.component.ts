import { Component, OnInit } from '@angular/core';
import { ExternalLoginProvidersFormType } from '../../classes/enums';
import { Modal } from '../../classes/modal';

@Component({
  selector: 'external-login-providers-form',
  templateUrl: './external-login-providers-form.component.html',
  styleUrls: [
    '../../../scss/gold-buttons.scss',
    '../../../scss/horizontal-groove-line.scss',
    '../../../scss/purple-text.scss',
    '../../../scss/vertical-line.scss',
    './external-login-providers-form.component.scss'
  ]
})
export class ExternalLoginProvidersFormComponent extends Modal implements OnInit {
  public type!: ExternalLoginProvidersFormType;
  public headerText!: string;
  public preText!: string;
  public buttonText!: string;
  public footerText1!: string;
  public footerText2!: string;


  ngOnInit(): void {
    if (this.type == ExternalLoginProvidersFormType.SignUp) {
      this.setSignUpText();
    } else {
      this.setLogInText();
    }
  }

  setSignUpText(): void {
    this.headerText = 'Sign Up';
    this.preText = 'Sign up';
    this.buttonText = 'Create an account';
    this.footerText1 = 'Already a member?';
    this.footerText2 = 'Log In';
  }


  setLogInText(): void {
    this.headerText = 'Log In';
    this.preText = 'Log in';
    this.buttonText = 'Log into your account';
    this.footerText1 = 'Not a member yet?';
    this.footerText2 = 'Sign Up';
  }


  setExternalLoginProvidersText(): void {
    if (this.type == ExternalLoginProvidersFormType.SignUp) {
      this.type = ExternalLoginProvidersFormType.LogIn;
      this.setLogInText();
    } else {
      this.type = ExternalLoginProvidersFormType.SignUp;
      this.setSignUpText();
    }
  }

  async onCreateAccountButtonClick(): Promise<void> {
    this.close();

    if (this.type == ExternalLoginProvidersFormType.SignUp) {
      const { CreateAccountFormComponent } = await import('../create-account-form/create-account-form.component');
      const { CreateAccountFormModule } = await import('../create-account-form/create-account-form.module');

      this.lazyLoadingService.getModuleRef(CreateAccountFormModule)
        .then(moduleRef => {
          const componentRef = this.lazyLoadingService.createComponent(CreateAccountFormComponent, 0, moduleRef.injector);
          componentRef.instance.viewRef = componentRef.hostView;
        })
    }
  }
}