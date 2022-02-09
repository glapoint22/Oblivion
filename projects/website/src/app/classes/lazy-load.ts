import { AfterViewInit, Directive, ElementRef, HostListener, QueryList, ViewChild, ViewChildren, ViewContainerRef, ViewRef } from "@angular/core";
import { Subject } from "rxjs";
import { LazyLoadingService } from "../services/lazy-loading/lazy-loading.service";

@Directive()
export class LazyLoad implements AfterViewInit {
    public show: boolean = false;
    public fadeOut: boolean = false;
    public viewRef!: ViewRef;
    public container!: ViewContainerRef;
    public setTimeOut!: number;
    public shiftKeyDown!: boolean;
    public tabIndex!: number | null;
    public tabElements!: Array<ElementRef<HTMLElement>>;
    public onTabElementsLoaded = new Subject<void>();
    @ViewChild('base') base!: ElementRef<HTMLElement>;
    @ViewChildren('tabElement') HTMLElements!: QueryList<ElementRef<HTMLElement>>;

    constructor(public lazyLoadingService: LazyLoadingService) { }


    @HostListener('window:resize')
    onWindowResize() {
        if (this.base) this.base.nativeElement.style.maxHeight = window.innerHeight + 'px';
    }


    ngOnInit(): void {
        this.addEventListeners();
        if (!this.lazyLoadingService.showBackdrop) {
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
        this.removeEventListeners();
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
        document.addEventListener("keydown", this.keyDown);
        document.addEventListener("keyup", this.keyUp);
    }

    removeEventListeners() {
        this.shiftKeyDown = false;
        document.removeEventListener("keydown", this.keyDown);
        document.removeEventListener("keyup", this.keyUp);
    }

    onTab(direction: number): void {
        if (this.tabElements) {

            // Initialize tabIndex to null
            this.tabIndex = null;

            // Loop through all the tab elements
            for (let i = 0; i < this.tabElements.length; i++) {

                // Check to see which tab element has the focus
                if (this.tabElements[i].nativeElement == document.activeElement) {

                    // Get the index value of the focused tab element
                    // then increment or decrement by one (depending on direction)
                    this.tabIndex = i + (1 * direction);

                    // Set the tab loop
                    if (this.tabIndex > this.tabElements.length - 1) this.tabIndex = 0;
                    if (this.tabIndex < 0) this.tabIndex = this.tabElements.length - 1;

                    // If the tab element is a button and that button is disabled
                    if (this.tabElements[this.tabIndex].nativeElement instanceof HTMLButtonElement && (this.tabElements[this.tabIndex].nativeElement as HTMLButtonElement).disabled) {
                        // Skip over that button
                        this.tabIndex = this.tabIndex + (1 * direction);
                        if (this.tabIndex > this.tabElements.length - 1) this.tabIndex = 0;
                        if (this.tabIndex < 0) this.tabIndex = this.tabElements.length - 1;
                    }
                    // Set focus to that tab element
                    this.tabElements[this.tabIndex].nativeElement.focus();
                    break;
                }
            }

            // If tabIndex is not defined that means the first tab element has not been set the focus yet
            if (!this.tabIndex) {

                // If the first tab element is a button and that button is disabled
                if (this.tabElements[0].nativeElement instanceof HTMLButtonElement && (this.tabElements[0].nativeElement as HTMLButtonElement).disabled) {
                    // Set focus to the second tab element
                    this.tabElements[1].nativeElement.focus();

                    // Otherwise, just set focus to the first tab element
                } else {
                    this.tabElements[0].nativeElement.focus();
                }
            }
        }
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
            this.onArrowUp(e);
        }

        if (e.key === 'ArrowDown') {
            this.onArrowDown(e);
        }
    }


    keyUp = (e: KeyboardEvent) => {
        if (e.key === 'Shift') {
            this.shiftKeyDown = false;
        }
    }
}