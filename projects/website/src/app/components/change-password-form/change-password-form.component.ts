import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { invalidPasswordValidator, matchPasswordValidator, Validation } from '../../classes/validation';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';

@Component({
  selector: 'change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.scss']
})
export class ChangePasswordFormComponent extends Validation implements OnInit {
  public isError!: boolean;

  constructor
    (private dataService: DataService,
      private lazyLoadingService: LazyLoadingService,
      private spinnerService: SpinnerService
    ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.form = new FormGroup({
      'currentPassword': new FormControl('', [
        Validators.required,
        invalidPasswordValidator()
      ]),
      'newPassword': new FormControl('', [
        Validators.required,
        invalidPasswordValidator()
      ]),
      'confirmPassword': new FormControl('', [
        Validators.required,
        invalidPasswordValidator()
      ])
    }, { validators: matchPasswordValidator });
  }


  onSubmit() {
    if (this.form.valid) {
      this.spinnerService.show = true;
      this.dataService
        .put<boolean>('api/Account/UpdatePassword', {
          CurrentPassword: this.form.get('currentPassword')?.value,
          NewPassword: this.form.get('newPassword')?.value
        }, { authorization: true })
        .subscribe((isError: boolean) => {
          if (isError) {
            this.isError = true;
            this.spinnerService.show = false;
            return;
          }
          this.fade();
          this.OpenSuccessPrompt();
        });
    }
  }


  async OpenSuccessPrompt() {
    document.removeEventListener("keydown", this.keyDown);
    const { SuccessPromptComponent } = await import('../success-prompt/success-prompt.component');
    const { SuccessPromptModule } = await import('../success-prompt/success-prompt.module');

    this.lazyLoadingService.getComponentAsync(SuccessPromptComponent, SuccessPromptModule, this.lazyLoadingService.container)
      .then((successPrompt: SuccessPromptComponent) => {
        successPrompt.header = 'Successful Password Change';
        successPrompt.message = 'Your password has been successfully changed.';
        successPrompt.changePasswordForm = this;
        this.spinnerService.show = false;
      });
  }
}