import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Validation } from '../../classes/validation';

@Component({
  selector: 'app-forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.scss']
})
export class ForgotPasswordFormComponent extends Validation implements OnInit {


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
    const { LogInFormModule } = await import('../log-in-form/log-in-form.module')
    const { LogInFormComponent } = await import('../log-in-form/log-in-form.component');

    this.lazyLoadingService.getModuleRef(LogInFormModule)
      .then(moduleRef => {
        this.lazyLoadingService.createComponent(LogInFormComponent, this.modalService.container, 0, moduleRef.injector);
      });
  }


  async openEmailSentPrompt(email: string) {
    const { EmailSentPromptComponent } = await import('../../components/email-sent-prompt/email-sent-prompt.component');
    const emailSentPromptComponent = this.lazyLoadingService.createComponent(EmailSentPromptComponent, this.modalService.container);
    emailSentPromptComponent.email = email;
  }
}