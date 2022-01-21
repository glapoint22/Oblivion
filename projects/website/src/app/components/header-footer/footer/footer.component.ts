import { Component } from '@angular/core';
import { LazyLoadingService } from '../../../services/lazy-loading/lazy-loading.service';
import { SpinnerService } from '../../../services/spinner/spinner.service';

@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(private lazyLoadingService: LazyLoadingService, private spinnerService: SpinnerService) { }

  async onContactUsClick() {
    this.spinnerService.show = true;
    const { ContactUsFormComponent } = await import('../../contact-us-form/contact-us-form.component');
    const { ContactUsFormModule } = await import('../../contact-us-form/contact-us-form.module')

    this.lazyLoadingService.getComponentAsync(ContactUsFormComponent, ContactUsFormModule, this.lazyLoadingService.container)
      .then(() => {
        this.spinnerService.show = false;
      });
  }
}