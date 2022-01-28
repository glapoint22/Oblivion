import { Component, OnInit } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { AccountActivationPromptComponent } from '../../components/account-activation-prompt/account-activation-prompt.component';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';
import { LogInFormComponent } from '../log-in-form/log-in-form.component';

@Component({
  selector: 'account-not-activated-prompt',
  templateUrl: './account-not-activated-prompt.component.html',
  styleUrls: ['./account-not-activated-prompt.component.scss']
})
export class AccountNotActivatedPromptComponent extends LazyLoad {
  public email!: string;
  public logInForm!: LogInFormComponent;

  constructor
    (
      private dataService: DataService,
      private spinnerService: SpinnerService,
      private lazyLoadingService: LazyLoadingService
    ) { super() }


  onResendEmailClick() {
    this.spinnerService.show = true;
    this.dataService.get('api/Account/ResendAccountActivationEmail', [{ key: 'email', value: this.email }])
      .subscribe(() => {
        this.fade();
        this.openAccountActivationPrompt();
      });
  }


  async openAccountActivationPrompt() {
    document.removeEventListener("keydown", this.keyDown);
    const { AccountActivationPromptComponent } = await import('../../components/account-activation-prompt/account-activation-prompt.component');
    const { AccountActivationPromptModule } = await import('../../components/account-activation-prompt/account-activation-prompt.module');

    this.lazyLoadingService.getComponentAsync(AccountActivationPromptComponent, AccountActivationPromptModule, this.lazyLoadingService.container)
      .then((accountActivationPrompt: AccountActivationPromptComponent) => {
        accountActivationPrompt.email = this.email;
        accountActivationPrompt.accountNotActivatedPrompt = this;
        this.spinnerService.show = false;
      });
  }


  close() {
    super.close();
    if (this.logInForm) this.logInForm.close();
  }
}