import { Directive, ViewRef } from "@angular/core";
import { LazyLoadingService } from "../services/lazy-loading/lazy-loading.service";

@Directive()
export class Modal {
    public viewRef!: ViewRef;

    constructor(public lazyLoadingService: LazyLoadingService) { }

    close(): void {
        const index = this.lazyLoadingService.container.indexOf(this.viewRef);
        this.lazyLoadingService.container.remove(index);
    }
}