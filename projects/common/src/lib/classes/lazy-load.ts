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
    // public tabIndex!: number | null;
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
        window.addEventListener("keydown", this.keyDown);
        window.addEventListener("keyup", this.keyUp);
    }

    removeEventListeners() {
        this.shiftKeyDown = false;
        window.removeEventListener("keydown", this.keyDown);
        window.removeEventListener("keyup", this.keyUp);
    }


    onTab(direction: number): void {
        if (this.tabElements) {

            // Initialize tabIndex to null
            let tabIndex = null;

            // Loop through all the tab elements
            for (let i = 0; i < this.tabElements.length; i++) {

                // Check to see which tab element has the focus
                if (this.tabElements[i].nativeElement == document.activeElement) {

                    // Get the index value of the focused tab element
                    // then increment or decrement by one (depending on direction)
                    tabIndex = i + (1 * direction);

                    // Set the tab loop
                    if (tabIndex > this.tabElements.length - 1) tabIndex = 0;
                    if (tabIndex < 0) tabIndex = this.tabElements.length - 1;

                    this.checkIfDisabled(tabIndex, direction);
                    break;
                }
            }

            // If tabIndex is not defined that means the first tab element has not been set the focus yet
            if (!tabIndex) this.checkIfDisabled(0, direction);
        }
    }



    checkIfDisabled(tabIndex: number, direction: number): void {
        // If the current tab element is either a button or an input and it is disabled 
        if ((this.tabElements[tabIndex!].nativeElement instanceof HTMLButtonElement && (this.tabElements[tabIndex!].nativeElement as HTMLButtonElement).disabled) ||
            (this.tabElements[tabIndex!].nativeElement instanceof HTMLInputElement && (this.tabElements[tabIndex!].nativeElement as HTMLInputElement).disabled)) {

            // Increment or decrement by one (depending on direction)
            tabIndex = tabIndex! + (1 * direction);
            if (tabIndex > this.tabElements.length - 1) tabIndex = 0;
            if (tabIndex < 0) tabIndex = this.tabElements.length - 1;

            // And check to see if that tab element is disabled
            this.checkIfDisabled(tabIndex, direction);

            // If the current tab element is NOT disabled
        } else {

            // Then set focus to that tab element
            this.setFocus(tabIndex);
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