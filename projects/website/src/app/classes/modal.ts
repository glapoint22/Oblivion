import { Directive, HostListener } from "@angular/core";
import { LazyLoadingService } from "../services/lazy-loading/lazy-loading.service";
// import { ModalService } from "../services/modal/modal.service";

@Directive()
export class Modal {

    constructor(public lazyLoadingService: LazyLoadingService) { }

    close(): void {
        // this.modalService.container.clear();
    }


    @HostListener('window:keydown.escape') onEscape() {
        this.close();
    }
}