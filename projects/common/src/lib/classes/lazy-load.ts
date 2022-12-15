import { AfterViewInit, Directive, ElementRef, HostListener, QueryList, ViewChild, ViewChildren, ViewContainerRef, ViewRef } from "@angular/core";
import { Subject } from "rxjs";
import { LazyLoadingService } from "../services/lazy-loading/lazy-loading.service";
import { SpinnerService } from "../services/spinner/spinner.service";

@Directive()
export class LazyLoad implements AfterViewInit {
    private scrollbarWidth!: number;

    public show: boolean = false;
    public fadeOut: boolean = false;
    public viewRef!: ViewRef;
    public container!: ViewContainerRef;
    public setTimeOut!: number;
    public shiftKeyDown!: boolean;
    public tabElements!: Array<ElementRef<HTMLElement>>;
    public onTabElementsLoaded = new Subject<void>();
    public disableScrolling!: boolean;
    @ViewChild('base') base!: ElementRef<HTMLElement>;
    @ViewChildren('tabElement') HTMLElements!: QueryList<ElementRef<HTMLElement>>;


    constructor(public lazyLoadingService: LazyLoadingService) { }


    @HostListener('window:resize')
    onWindowResize() {
        if (this.base) this.base.nativeElement.style.maxHeight = window.innerHeight + 'px';
    }


    ngOnInit(): void {
        this.addEventListeners();
        this.disableScrolling = true;

        if (!this.lazyLoadingService.showBackdrop) {
            this.scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            this.lazyLoadingService.showBackdrop = true;
            window.setTimeout(() => {
                this.lazyLoadingService.backdropFadeIn = true;
            }, 50)
        }
    }

    ngAfterViewInit(): void {
        this.open();
        if (this.base) {
            this.base.nativeElement.style.maxHeight = window.innerHeight + 'px';
        }

        if (this.HTMLElements.length > 0) {
            this.tabElements = this.HTMLElements.toArray();
        }

        if (this.disableScrolling) {
            // If the window has overflow
            if (window.innerHeight != document.body.clientHeight) {
                document.body.style.overflow = "hidden";
                document.body.style.paddingRight = this.scrollbarWidth + 'px';
                this.lazyLoadingService.paddingRight = this.scrollbarWidth;

                // If it's an IOS device
                if (this.checkIos()) document.body.style.position = 'fixed';
            }

        }
    }



    private checkIos(): boolean {
        return (
            ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform) ||
            (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
        );
    }







    setFocus(index: number) {
        if (this.tabElements) {
            // If the tab element is an input text
            if (this.tabElements[index].nativeElement instanceof HTMLInputElement) {
                // Select the input text
                (this.tabElements[index].nativeElement as HTMLInputElement).select();
            } else {
                // Set focus to that tab element
                this.tabElements[index].nativeElement.focus();
            }
        }
    }


    open() {
        this.setTimeOut = window.setTimeout(() => {
            this.show = true;
            this.onOpen();
        }, 50);
    }


    close() {
        this.fade();
        this.lazyLoadingService.backdropFadeIn = false;
    }


    fade() {
        this.show = false;
        window.clearTimeout(this.setTimeOut);
    }

    onHide() {
        if (!this.show) {
            const index = this.container.indexOf(this.viewRef);
            this.container.remove(index);
        }
    }

    onOpen(): void { }




    addEventListeners() {
        window.addEventListener("keyup", this.keyUp);
        window.addEventListener("keydown", this.keyDown);
    }

    removeEventListeners() {
        this.shiftKeyDown = false;
        window.removeEventListener("keyup", this.keyUp);
        window.removeEventListener("keydown", this.keyDown);
    }




    onTab(direction: number): void {
        if (this.tabElements) {
            // Check to see if any tab element has focus
            let tabIndex = this.tabElements.findIndex(x => x.nativeElement == document.activeElement);

            // If a tab element has focus
            if (tabIndex != -1) {
                // Increment or decrement by one (depending on direction)
                tabIndex = tabIndex + (1 * direction);
                // Make sure we stay in bounds
                if (tabIndex > this.tabElements.length - 1) tabIndex = 0;
                if (tabIndex < 0) tabIndex = this.tabElements.length - 1;
                // Set focus to the next tab element in the list
                this.getNextTabElement(tabIndex, direction);

                // If a tab element does (NOT) have focus yet
            } else {
                // Set focus to the first tab element in the list
                this.getNextTabElement(0, direction);
            }
        }
    }








    getNextTabElement(tabIndex: number, direction: number): void {
        // If the current tab element is either a button or an input and it is disabled 
        if ((this.tabElements[tabIndex].nativeElement instanceof HTMLButtonElement && (this.tabElements[tabIndex].nativeElement as HTMLButtonElement).disabled) ||
            (this.tabElements[tabIndex].nativeElement instanceof HTMLInputElement && (this.tabElements[tabIndex].nativeElement as HTMLInputElement).disabled)) {

            // Increment or decrement by one (depending on direction)
            tabIndex = tabIndex! + (1 * direction);
            if (tabIndex > this.tabElements.length - 1) tabIndex = 0;
            if (tabIndex < 0) tabIndex = this.tabElements.length - 1;

            // And check to see if this next tab element is also disabled
            this.getNextTabElement(tabIndex, direction);

            // If the current tab element is NOT disabled
        } else {
            this.setFocusToTabElement(tabIndex, direction)
        }
    }


    setFocusToTabElement(tabIndex: number, direction?: number) {
        this.setFocus(tabIndex);
    }















    onEscape(): void {
        this.close();
    }

    onEnter(e: KeyboardEvent): void { }

    onSpace(e: KeyboardEvent): void { }

    onArrowLeft(e: KeyboardEvent): void { }

    onArrowRight(e: KeyboardEvent): void { }

    onArrowUp(e: KeyboardEvent): void { }

    onArrowDown(e: KeyboardEvent): void { }

    keyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            this.onEscape();
        }

        if (e.key === 'Tab') {
            e.preventDefault();
            let direction = this.shiftKeyDown ? -1 : 1;
            this.onTab(direction);
        }

        if (e.key === 'Shift') {
            this.shiftKeyDown = true;
        }

        if (e.key === 'Enter') {
            this.onEnter(e);
        }

        if (e.key === ' ') {
            this.onSpace(e);
        }

        if (e.key === 'ArrowLeft') {
            this.onArrowLeft(e);
        }

        if (e.key === 'ArrowRight') {
            this.onArrowRight(e);
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.onArrowUp(e);
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.onArrowDown(e);
        }



    }


    keyUp = (e: KeyboardEvent) => {
        if (e.key === 'Shift') {
            this.shiftKeyDown = false;
        }
    }



    ngOnDestroy() {
        this.removeEventListeners();

        if (this.disableScrolling && !this.lazyLoadingService.backdropFadeIn) {
            document.body.style.overflow = "auto";
            document.body.style.paddingRight = '0';
            this.lazyLoadingService.paddingRight = 0;
            if (this.checkIos()) document.body.style.position = 'static';
        }
    }
}