import { Directive } from "@angular/core";
import { LazyLoadingService } from "../services/lazy-loading/lazy-loading.service";
import { SpinnerAction } from "./enums";

@Directive()
export class PrivacyTerms {
    constructor(private lazyLoadingService: LazyLoadingService) { }

    async onContactUsClick() {
        this.lazyLoadingService.load(async () => {
            const { ContactUsFormComponent } = await import('../components/contact-us-form/contact-us-form.component');
            const { ContactUsFormModule } = await import('../components/contact-us-form/contact-us-form.module');

            return {
                component: ContactUsFormComponent,
                module: ContactUsFormModule
            }
        }, SpinnerAction.StartEnd);
    }

    getAnchorOffset(): number {
        const headerContainerElement = document.getElementsByClassName('header-container')[0] as HTMLElement;
        return headerContainerElement.getBoundingClientRect().height + 10;
    }
}