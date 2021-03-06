import { Component } from '@angular/core';
import { LazyLoadingService, SpinnerAction } from 'common';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(private lazyLoadingService: LazyLoadingService) { }

  async onContactUsClick() {
    this.lazyLoadingService.load(async () => {
      const { ContactUsFormComponent } = await import('../../contact-us-form/contact-us-form.component');
      const { ContactUsFormModule } = await import('../../contact-us-form/contact-us-form.module');

      return {
        component: ContactUsFormComponent,
        module: ContactUsFormModule
      }
    }, SpinnerAction.StartEnd);
  }
}