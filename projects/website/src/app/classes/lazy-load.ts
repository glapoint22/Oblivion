import { AfterViewInit, Directive, ElementRef, HostListener, ViewChild, ViewContainerRef, ViewRef } from "@angular/core";

@Directive()
export class LazyLoad implements AfterViewInit {
    public show: boolean = false;
    public fadeOut: boolean = false;
    public viewRef!: ViewRef;
    public container!: ViewContainerRef;
    public setTimeOut!: number;
    @ViewChild('base') base!: ElementRef<HTMLElement>;

    @HostListener('window:resize')
    onWindowResize() {
        if (this.base) this.base.nativeElement.style.maxHeight = window.innerHeight + 'px';
    }

    ngOnInit(): void {
        this.addEventListener();
    }

    ngAfterViewInit(): void {
        this.open();
        if (this.base) this.base.nativeElement.style.maxHeight = window.innerHeight + 'px';
    }


    open() {
        this.setTimeOut = window.setTimeout(() => {
            this.show = true;
            this.onOpen();
        }, 50);
    }


    close() {
        document.removeEventListener("keydown", this.keyDown);
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


    addEventListener() {
        document.addEventListener("keydown", this.keyDown);
    }


    keyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            this.close();
        }
    }
}