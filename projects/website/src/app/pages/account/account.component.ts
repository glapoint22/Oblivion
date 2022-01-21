import { Component } from '@angular/core';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../services/spinner/spinner.service';

@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {

  constructor(private lazyLoadingService: LazyLoadingService, private spinnerService: SpinnerService) { }

  async onContactUsClick() {
    this.spinnerService.show = true;
    const { ContactUsFormComponent } = await import('../../components/contact-us-form/contact-us-form.component');
    const { ContactUsFormModule } = await import('../../components/contact-us-form/contact-us-form.module')

    this.lazyLoadingService.getComponentAsync(ContactUsFormComponent, ContactUsFormModule, this.lazyLoadingService.container)
      .then(() => {
        this.spinnerService.show = false;
      });
  }


  async onDeleteAccount() {
    this.spinnerService.show = true;
    const { DeleteAccountPromptComponent } = await import('../../components/delete-account-prompt/delete-account-prompt.component');
    const { DeleteAccountPromptModule } = await import('../../components/delete-account-prompt/delete-account-prompt.module')

    this.lazyLoadingService.getComponentAsync(DeleteAccountPromptComponent, DeleteAccountPromptModule, this.lazyLoadingService.container)
      .then(() => {
        this.spinnerService.show = false;
      });
  }
}