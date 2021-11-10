import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { invalidPasswordValidator, Validation } from '../../classes/validation';
import { CustomerService } from '../../services/customer/customer.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { ForgotPasswordFormComponent } from '../forgot-password-form/forgot-password-form.component';
import { SignUpFormComponent } from '../sign-up-form/sign-up-form.component';

@Component({
  selector: 'log-in-form',
  templateUrl: './log-in-form.component.html',
  styleUrls: ['./log-in-form.component.scss']
})
export class LogInFormComponent extends Validation implements OnInit {
  public isPersistent: boolean = true;

  constructor(
    private dataService: DataService,
    private customerService: CustomerService,
    private lazyLoadingService: LazyLoadingService,
  ) { super() }

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
      this.dataService.post('api/Account/SignIn', {
        email: this.form.get('email')?.value,
        password: this.form.get('password')?.value,
        isPersistent: this.isPersistent
      }).subscribe(() => {
        this.customerService.setCustomer();
        this.close();
      })
    }
  }


  async onSignUpLinkClick() {
    this.close();
    const { SignUpFormComponent } = await import('../sign-up-form/sign-up-form.component');
    const { SignUpFormModule } = await import('../sign-up-form/sign-up-form.module')

    this.lazyLoadingService.getComponentAsync(SignUpFormComponent, SignUpFormModule, this.lazyLoadingService.container);
  }


  async onForgotPasswordLinkClick() {
    this.close();
    const { ForgotPasswordFormComponent } = await import('../forgot-password-form/forgot-password-form.component');
    const { ForgotPasswordFormModule } = await import('../forgot-password-form/forgot-password-form.module');

    this.lazyLoadingService.getComponentAsync(ForgotPasswordFormComponent, ForgotPasswordFormModule, this.lazyLoadingService.container);
  }
}