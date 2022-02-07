import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoad } from '../../classes/lazy-load';
import { AccountActivationPromptComponent } from '../../components/account-activation-prompt/account-activation-prompt.component';
import { DataService } from '../../services/data/data.service';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';

@Component({
  selector: 'account-not-activated-prompt',
  templateUrl: './account-not-activated-prompt.component.html',
  styleUrls: ['./account-not-activated-prompt.component.scss']
})
export class AccountNotActivatedPromptComponent extends LazyLoad {
  public email!: string;
  public isLoginPage!: boolean;

  constructor
    (
      lazyLoadingService: LazyLoadingService,
      private dataService: DataService,
      private spinnerService: SpinnerService,
      private router: Router
    ) { super(lazyLoadingService) }


  ngOnInit(): void {
    super.ngOnInit();
    this.isLoginPage = this.router.url.includes('log-in');
  }


  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    if (this.tabElements) this.tabElements[0].nativeElement.focus();
  }


  onResendEmailClick() {
    this.spinnerService.show = true;
    this.dataService.get('api/Account/ResendAccountActivationEmail', [{ key: 'email', value: this.email }])
      .subscribe(() => {
        this.openAccountActivationPrompt();
      });
  }


  async openAccountActivationPrompt() {
    this.fade();
    const { AccountActivationPromptComponent } = await import('../../components/account-activation-prompt/account-activation-prompt.component');
    const { AccountActivationPromptModule } = await import('../../components/account-activation-prompt/account-activation-prompt.module');

    this.lazyLoadingService.getComponentAsync(AccountActivationPromptComponent, AccountActivationPromptModule, this.lazyLoadingService.container)
      .then((accountActivationPrompt: AccountActivationPromptComponent) => {
        accountActivationPrompt.email = this.email;
        this.spinnerService.show = false;
      });
  }
}