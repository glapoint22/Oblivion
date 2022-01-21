import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Validation } from '../../classes/validation';
import { AccountService } from '../../services/account/account.service';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { EmailVerificationFormComponent } from '../email-verification-form/email-verification-form.component';

@Component({
  selector: 'change-email-form',
  templateUrl: './change-email-form.component.html',
  styleUrls: ['./change-email-form.component.scss']
})
export class ChangeEmailFormComponent extends Validation implements OnInit {
  public isError: boolean = false;

  constructor
    (
      public accountService: AccountService,
      private dataService: DataService,
      private lazyLoadingService: LazyLoadingService,
      private spinnerService: SpinnerService
    ) {
    super();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(this.accountService.customer?.email, [
        Validators.required,
        Validators.email
      ])
    });
  }


  onSubmit() {
    if (this.form.valid) {
      this.spinnerService.show = true;
      this.dataService.get('api/Account/CreateChangeEmailOTP', [{ key: 'email', value: this.form.get('email')?.value }], { authorization: true })
        .subscribe(error => {
          if (error) {
            this.isError = true;
            return;
          }
          this.openEmailverificationForm();
        });
    }
  }

  async openEmailverificationForm() {
    this.close();
    const { EmailVerificationFormComponent } = await import('../email-verification-form/email-verification-form.component');
    const { EmailVerificationFormModule } = await import('../email-verification-form/email-verification-form.module');

    this.lazyLoadingService.getComponentAsync(EmailVerificationFormComponent, EmailVerificationFormModule, this.lazyLoadingService.container)
      .then((emailVerificationFormComponent: EmailVerificationFormComponent) => {
        emailVerificationFormComponent.email = this.form.get('email')?.value;
        this.spinnerService.show = false;
      });
  }
}