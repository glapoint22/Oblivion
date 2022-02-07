import { Directive } from "@angular/core";
import { LazyLoadingService } from "../services/lazy-loading/lazy-loading.service";
import { SpinnerService } from "../services/spinner/spinner.service";

@Directive()
export class PrivacyTerms {
    constructor(private lazyLoadingService: LazyLoadingService, private spinnerService: SpinnerService) { }

    async onContactUsClick() {
        this.spinnerService.show = true;
        const { ContactUsFormComponent } = await import('../components/contact-us-form/contact-us-form.component');
        const { ContactUsFormModule } = await import('../components/contact-us-form/contact-us-form.module')

        this.lazyLoadingService.getComponentAsync(ContactUsFormComponent, ContactUsFormModule, this.lazyLoadingService.container)
            .then(() => {
                this.spinnerService.show = false;
            });
    }

    getAnchorOffset(): number {
        const headerContainerElement = document.getElementsByClassName('header-container')[0] as HTMLElement;
        return headerContainerElement.getBoundingClientRect().height + 10;
    }
}