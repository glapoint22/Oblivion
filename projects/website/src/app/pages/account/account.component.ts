import { Component, OnInit } from '@angular/core';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';

@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {

  constructor(private lazyLoadingService: LazyLoadingService) { }



  async onContactUsClick() {
    const { ContactUsFormComponent } = await import('../../components/contact-us-form/contact-us-form.component');
    const { ContactUsFormModule } = await import('../../components/contact-us-form/contact-us-form.module')

    this.lazyLoadingService.getComponentAsync(ContactUsFormComponent, ContactUsFormModule, this.lazyLoadingService.container);
  }
}
