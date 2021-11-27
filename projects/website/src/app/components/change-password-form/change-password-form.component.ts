import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { invalidPasswordValidator, matchPasswordValidator, Validation } from '../../classes/validation';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SuccessPromptComponent } from '../success-prompt/success-prompt.component';

@Component({
  selector: 'change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.scss']
})
export class ChangePasswordFormComponent extends Validation implements OnInit {

  constructor(private dataService: DataService, private lazyLoadingService: LazyLoadingService) {
    super();
  }

  ngOnInit(): void {
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
      this.dataService.put('api/Account/UpdatePassword', { CurrentPassword: this.form.get('currentPassword')?.value, NewPassword: this.form.get('newPassword')?.value }, true)
        .subscribe(() => {
          this.close();
          this.OpenSuccessPrompt();
        });
    }
  }


  async OpenSuccessPrompt() {
    const { SuccessPromptComponent } = await import('../success-prompt/success-prompt.component');
    const { SuccessPromptModule } = await import('../success-prompt/success-prompt.module');

    this.lazyLoadingService.getComponentAsync(SuccessPromptComponent, SuccessPromptModule, this.lazyLoadingService.container)
      .then((successPromptComponent: SuccessPromptComponent) => {
        successPromptComponent.header = 'Successful Password Change';
        successPromptComponent.message = 'Your password has been successfully changed.';
      });
  }
}