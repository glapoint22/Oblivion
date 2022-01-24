import { AfterViewInit, Directive, ViewContainerRef, ViewRef } from "@angular/core";

@Directive()
export class LazyLoad implements AfterViewInit {
    public show: boolean = false;
    public fadeOut: boolean = false;
    public viewRef!: ViewRef;
    public container!: ViewContainerRef;
    public setTimeOut!: number;

    ngAfterViewInit(): void {
        this.open();
    }


    open() {
        this.setTimeOut = window.setTimeout(() => {
            this.show = true;
            this.onOpen();
        }, 50);
    }


    close() {
        this.show = false;
        window.clearTimeout(this.setTimeOut);
    }


    fade() {
        this.fadeOut = true;
        window.clearTimeout(this.setTimeOut);
    }

    
    onHide() {
        if (!this.show) {
            const index = this.container.indexOf(this.viewRef);
            this.container.remove(index);
        }
    }

    onOpen(): void { }
}