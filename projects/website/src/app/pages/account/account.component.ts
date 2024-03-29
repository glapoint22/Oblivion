import { Component } from '@angular/core';
import { LazyLoadingService, SpinnerAction } from 'common';
import { SocialMediaService } from '../../services/social-media/social-media.service';

@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {

  constructor(private lazyLoadingService: LazyLoadingService, private socialMediaService: SocialMediaService) { }

  ngOnInit(): void {
    // Set the meta tags
    this.socialMediaService.addMetaTags('Your Account');
  }

  async onContactUsClick() {
    this.lazyLoadingService.load(async () => {
      const { ContactUsFormComponent } = await import('../../components/contact-us-form/contact-us-form.component');
      const { ContactUsFormModule } = await import('../../components/contact-us-form/contact-us-form.module');

      return {
        component: ContactUsFormComponent,
        module: ContactUsFormModule
      }
    }, SpinnerAction.StartEnd);
  }


  async onDeleteAccount() {
    this.lazyLoadingService.load(async () => {
      const { DeleteAccountPromptComponent } = await import('../../components/delete-account-prompt/delete-account-prompt.component');
      const { DeleteAccountPromptModule } = await import('../../components/delete-account-prompt/delete-account-prompt.module');

      return {
        component: DeleteAccountPromptComponent,
        module: DeleteAccountPromptModule
      }
    }, SpinnerAction.StartEnd);
  }
}