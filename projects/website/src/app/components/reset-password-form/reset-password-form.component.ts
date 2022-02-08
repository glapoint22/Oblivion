import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Validation } from '../../classes/validation';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';

@Component({
  selector: 'reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss']
})
export class ResetPasswordFormComponent extends Validation {
  public email!: string;
  public oneTimePassword!: string;

  constructor
    (
      dataService: DataService,
      lazyLoadingService: LazyLoadingService,
      private spinnerService: SpinnerService,
    ) { super(dataService, lazyLoadingService) }

  ngOnInit(): void {
    this.form = new FormGroup({
      newPassword: new FormControl('', {
        validators: [
          Validators.required,
          this.invalidPasswordValidator()
        ],
        updateOn: 'submit'
      }),
      confirmPassword: new FormControl('', {
        validators: [
          Validators.required,
          this.invalidPasswordValidator()
        ],
        updateOn: 'submit'
      })
    }, {
      validators: this.matchPasswordValidator,
      updateOn: 'submit'
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.spinnerService.show = true;
      this.dataService.post<boolean>('api/Account/ResetPassword', {
        email: this.email,
        password: this.form.get('newPassword')?.value,
        oneTimePassword: this.oneTimePassword
      }).subscribe((isError: boolean) => {
        if (isError) {
        } else {
          this.OpenSuccessPrompt();
        }
      });
    }
  }


  async OpenSuccessPrompt() {
    this.fade();
    const { SuccessPromptComponent } = await import('../../components/success-prompt/success-prompt.component');
    const { SuccessPromptModule } = await import('../../components/success-prompt/success-prompt.module');

    this.lazyLoadingService.getComponentAsync(SuccessPromptComponent, SuccessPromptModule, this.lazyLoadingService.container)
      .then((successPromptComponent: SuccessPromptComponent) => {
        successPromptComponent.header = 'Successful Password Reset';
        successPromptComponent.message = 'Your password has been successfully reset.';
        this.spinnerService.show = false;
      });
  }
}
