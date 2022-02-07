import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Validation } from '../../classes/validation';
import { EmailSentPromptComponent } from '../../components/email-sent-prompt/email-sent-prompt.component';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';

@Component({
  selector: 'forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.scss']
})
export class ForgotPasswordFormComponent extends Validation implements OnInit {
  public isError!: boolean;
  public isLoginPage!: boolean;

  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private spinnerService: SpinnerService,
      private dataService: DataService,
      private router: Router
    ) { super(lazyLoadingService) }


  ngOnInit(): void {
    super.ngOnInit();
    this.isLoginPage = this.router.url.includes('log-in');

    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ])
    });
  }


  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.tabElements) this.tabElements[0].nativeElement.focus();
  }


  onSubmit() {
    this.isError = false;
    if (this.form.valid) {
      this.dataService.get<boolean>('api/Account/ForgetPassword', [{
        key: 'email',
        value: this.form.get('email')?.value
      }]).subscribe((isError: boolean) => {
        if (isError) {
          this.isError = true;
        } else {
          this.openEmailSentPrompt(this.form.get('email')?.value);
        }
      });
    }
  }


  async onLogInLinkClick() {
    this.fade();
    this.spinnerService.show = true;
    const { LogInFormComponent } = await import('../log-in-form/log-in-form.component');
    const { LogInFormModule } = await import('../log-in-form/log-in-form.module')

    this.lazyLoadingService.getComponentAsync(LogInFormComponent, LogInFormModule, this.lazyLoadingService.container)
      .then(() => {
        this.spinnerService.show = false;
      });
  }


  async openEmailSentPrompt(email: string) {
    this.fade();
    this.spinnerService.show = true;
    const { EmailSentPromptComponent } = await import('../../components/email-sent-prompt/email-sent-prompt.component');
    const { EmailSentPromptModule } = await import('../../components/email-sent-prompt/email-sent-prompt.module');

    this.lazyLoadingService.getComponentAsync(EmailSentPromptComponent, EmailSentPromptModule, this.lazyLoadingService.container)
      .then((emailSentPrompt: EmailSentPromptComponent) => {
        emailSentPrompt.email = email;
        this.spinnerService.show = false;
      });
  }


  onEnter(e: KeyboardEvent): void {
    if (this.tabElements && this.tabElements[2].nativeElement == document.activeElement) {
      this.onLogInLinkClick();
    }
  }
}