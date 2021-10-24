import { Directive, ViewRef } from "@angular/core";
import { LazyLoadingService } from "../services/lazy-loading/lazy-loading.service";

@Directive()
export class LazyLoading {
    public viewRef!: ViewRef;

    constructor(public lazyLoadingService: LazyLoadingService) { }

    remove(): void {
        const index = this.lazyLoadingService.container.indexOf(this.viewRef);
        this.lazyLoadingService.container.remove(index);
    }
}