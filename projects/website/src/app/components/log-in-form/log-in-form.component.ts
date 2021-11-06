import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { invalidPasswordValidator, Validation } from '../../classes/validation';
import { CustomerService } from '../../services/customer/customer.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'log-in-form',
  templateUrl: './log-in-form.component.html',
  styleUrls: ['./log-in-form.component.scss']
})
export class LogInFormComponent extends Validation implements OnInit {
  public isPersistent: boolean = true;
  constructor(lazyLoadingService: LazyLoadingService, modalService: ModalService, private dataService: DataService, private customerService: CustomerService) { super(lazyLoadingService, modalService) }


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