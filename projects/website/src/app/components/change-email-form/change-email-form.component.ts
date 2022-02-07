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
      lazyLoadingService: LazyLoadingService,
      public accountService: AccountService,
      private dataService: DataService,
      private spinnerService: SpinnerService
    ) { super(lazyLoadingService) }


  ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup({
      email: new FormControl(this.accountService.customer?.email, [
        Validators.required,
        Validators.email
      ])
    });
  }


  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    if (this.tabElements) this.tabElements[0].nativeElement.focus();
  }


  onSubmit() {
    if (this.form.valid) {
      this.spinnerService.show = true;
      this.dataService.get('api/Account/CreateChangeEmailOTP', [{ key: 'email', value: this.form.get('email')?.value }], { authorization: true })
        .subscribe(error => {
          if (error) {
            this.isError = true;
            this.spinnerService.show = false;
            return;
          }
          this.openEmailverificationForm();
        });
    }
  }


  async openEmailverificationForm() {
    this.fade();
    const { EmailVerificationFormComponent } = await import('../email-verification-form/email-verification-form.component');
    const { EmailVerificationFormModule } = await import('../email-verification-form/email-verification-form.module');

    this.lazyLoadingService.getComponentAsync(EmailVerificationFormComponent, EmailVerificationFormModule, this.lazyLoadingService.container)
      .then((emailVerificationForm: EmailVerificationFormComponent) => {
        emailVerificationForm.email = this.form.get('email')?.value;
        this.spinnerService.show = false;
      });
  }
}