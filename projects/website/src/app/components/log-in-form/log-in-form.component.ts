import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { invalidPasswordValidator, Validation } from '../../classes/validation';

@Component({
  selector: 'log-in-form',
  templateUrl: './log-in-form.component.html',
  styleUrls: ['./log-in-form.component.scss']
})
export class LogInFormComponent extends Validation implements OnInit {


  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        invalidPasswordValidator()
      ])
    });
  }



  onLogIn() {
    if (this.form.valid) {
      console.log('Submit');
    }
  }


  async onSignUpLinkClick() {
    const { SignUpFormModule } = await import('../sign-up-form/sign-up-form.module')
    const { SignUpFormComponent } = await import('../sign-up-form/sign-up-form.component');

    
    this.close();
    this.lazyLoadingService.getModuleRef(SignUpFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(SignUpFormComponent, this.modalService.container, 0, moduleRef.injector);
      });
  }


  async onForgotPasswordLinkClick() {
    const { ForgotPasswordFormComponent } = await import('../forgot-password-form/forgot-password-form.component');
    const { ForgotPasswordFormModule } = await import('../forgot-password-form/forgot-password-form.module');

    this.close();
    this.lazyLoadingService.getModuleRef(ForgotPasswordFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(ForgotPasswordFormComponent, this.modalService.container, 0, moduleRef.injector);
      });
  }
}