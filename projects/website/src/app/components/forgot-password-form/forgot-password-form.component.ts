import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Validation } from '../../classes/validation';
import { EmailSentPromptComponent } from '../../components/email-sent-prompt/email-sent-prompt.component';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { LogInFormComponent } from '../log-in-form/log-in-form.component';

@Component({
  selector: 'forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.scss']
})
export class ForgotPasswordFormComponent extends Validation implements OnInit {

  constructor(private lazyLoadingService: LazyLoadingService) {super()}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ])
    });
  }


  onSubmit() {
    if (this.form.valid) {
      console.log('Submit');
      this.close();
      this.openEmailSentPrompt(this.form.get('email')?.value);
    }
  }


  async onLogInLinkClick() {
    this.close();
    const { LogInFormComponent } = await import('../log-in-form/log-in-form.component');
    const { LogInFormModule } = await import('../log-in-form/log-in-form.module')
    

    this.lazyLoadingService.getComponentAsync(LogInFormComponent, LogInFormModule, this.lazyLoadingService.container);
  }


  async openEmailSentPrompt(email: string) {
    const { EmailSentPromptComponent } = await import('../../components/email-sent-prompt/email-sent-prompt.component');
    const { EmailSentPromptModule } = await import('../../components/email-sent-prompt/email-sent-prompt.module');
    
    this.lazyLoadingService.getComponentAsync(EmailSentPromptComponent, EmailSentPromptModule, this.lazyLoadingService.container)
    .then((emailSentPrompt: EmailSentPromptComponent) => {
      emailSentPrompt.email = email;
    });
  }
}