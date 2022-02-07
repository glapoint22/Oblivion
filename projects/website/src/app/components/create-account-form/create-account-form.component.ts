import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Validation } from '../../classes/validation';
import { ActivateAccountFormComponent } from '../../components/activate-account-form/activate-account-form.component';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { LogInFormComponent } from '../log-in-form/log-in-form.component';
import { SignUpFormComponent } from '../sign-up-form/sign-up-form.component';


@Component({
  selector: 'create-account-form',
  templateUrl: './create-account-form.component.html',
  styleUrls: ['./create-account-form.component.scss']
})
export class CreateAccountFormComponent extends Validation implements OnInit {
  public signUpForm!: SignUpFormComponent;
  public isLoginPage!: boolean;

  constructor
    (
      dataService: DataService,
      private lazyLoadingService: LazyLoadingService,
      private spinnerService: SpinnerService,
      private router: Router
    ) { super(dataService) }


  ngOnInit(): void {
    super.ngOnInit();
    this.isLoginPage = this.router.url.includes('log-in');


    this.form = new FormGroup({
      firstName: new FormControl('', {
        validators: [
          Validators.required,
          this.invalidNameValidator(),
          Validators.maxLength(40)
        ],
        updateOn: 'submit'
      }),
      lastName: new FormControl('', {
        validators: [
          Validators.required,
          this.invalidNameValidator(),
          Validators.maxLength(40)
        ],
        updateOn: 'submit'
      }),
      password: new FormControl('', {
        validators: [
          Validators.required,
          this.invalidPasswordValidator()
        ],
        updateOn: 'submit'
      }),
      email: new FormControl('', {
        validators: [
          Validators.required,
          Validators.email
        ],
        asyncValidators: this.validateEmailAsync('api/Account/ValidateEmail'),
        updateOn: 'submit'
      })
    });

    this.form.statusChanges.subscribe((status: string) => {
      if (status == 'VALID') {
        this.dataService.post('api/Account/SignUp', {
          firstName: this.form.get('firstName')?.value,
          lastName: this.form.get('lastName')?.value,
          email: this.form.get('email')?.value,
          password: this.form.get('password')?.value
        }, {
          showSpinner: true
        }).subscribe(() => {
          this.fade();
          this.openAccountActivationForm();
        });
      }
    });
  }





  async onLogInLinkClick() {
    document.removeEventListener("keydown", this.keyDown);
    this.spinnerService.show = true;
    this.fade();
    const { LogInFormComponent } = await import('../log-in-form/log-in-form.component');
    const { LogInFormModule } = await import('../log-in-form/log-in-form.module')

    this.lazyLoadingService.getComponentAsync(LogInFormComponent, LogInFormModule, this.lazyLoadingService.container)
      .then((loginForm: LogInFormComponent) => {
        loginForm.createAccountForm = this;
        this.spinnerService.show = false;
      });
  }





  async openAccountActivationForm() {
    document.removeEventListener("keydown", this.keyDown);
    this.spinnerService.show = true;
    this.fade();
    const { ActivateAccountFormComponent } = await import('../../components/activate-account-form/activate-account-form.component');
    const { ActivateAccountFormModule } = await import('../../components/activate-account-form/activate-account-form.module');

    this.lazyLoadingService.getComponentAsync(ActivateAccountFormComponent, ActivateAccountFormModule, this.lazyLoadingService.container)
      .then((ActivateAccountForm: ActivateAccountFormComponent) => {
        ActivateAccountForm.email = this.form.get('email')?.value;
        this.spinnerService.show = false;
      });
  }


  close() {
    super.close();
    if (this.signUpForm) this.signUpForm.close();
  }
}