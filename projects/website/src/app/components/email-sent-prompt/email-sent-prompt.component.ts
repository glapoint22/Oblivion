import { Component } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { ForgotPasswordFormComponent } from '../forgot-password-form/forgot-password-form.component';

@Component({
  selector: 'email-sent-prompt',
  templateUrl: './email-sent-prompt.component.html',
  styleUrls: ['./email-sent-prompt.component.scss']
})
export class EmailSentPromptComponent extends LazyLoad {
  public email!: string;
  public forgotPasswordForm!: ForgotPasswordFormComponent;

  close() {
    super.close();
    if (this.forgotPasswordForm) this.forgotPasswordForm.close();
  }
}
