import { AfterViewInit, Directive, ViewContainerRef, ViewRef } from "@angular/core";

@Directive()
export class LazyLoad implements AfterViewInit {
    public show: boolean = false;
    public viewRef!: ViewRef;
    public container!: ViewContainerRef;

    ngAfterViewInit(): void {
        this.open();
    }


    open() {
        window.setTimeout(() => {
            this.show = true;
            this.onOpen();
        }, 50);
    }


    close() {
        this.show = false;
    }

    onHide() {
        if (!this.show) {
            const index = this.container.indexOf(this.viewRef);
            this.container.remove(index);
        }
    }

    onOpen(): void { }
}