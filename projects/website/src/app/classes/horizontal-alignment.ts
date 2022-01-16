import { Breakpoint } from "./breakpoint";
import { BreakpointType, HorizontalAlign } from "./enums";

export class HorizontalAlignment {

    constructor(private value: string) { }

    setClass(element: HTMLElement, breakpoints: Array<Breakpoint>) {
        if (!breakpoints && !this.value) return;

        let horizontalAlignmentBreakpoints: Array<Breakpoint> = [];

        if (breakpoints) horizontalAlignmentBreakpoints = breakpoints.filter(x => x.breakpointType == BreakpointType.HorizontalAlignment);

        // If there are any breakpoints, add each breakpoint class 
        if (horizontalAlignmentBreakpoints.length > 0) {
            horizontalAlignmentBreakpoints.forEach((breakpoint: Breakpoint) => {
                element.classList.add(this.getClassName(breakpoint.value) + '-' + breakpoint.screenSize.toLowerCase());
            });

            // We have no breakpoints, add a single class
        } else if (this.value) {
            if (this.value != HorizontalAlign.Left) element.classList.add(this.getClassName(this.value));
        }
    }



    public getClassName(value: string): string {
        let className: string = '';

        switch (value) {
            case HorizontalAlign.Left:
                className = 'horizontal-align-left';
                break;

            case HorizontalAlign.Center:
                className = 'horizontal-align-center';
                break;

            case HorizontalAlign.Right:
                className = 'horizontal-align-right';
                break;
        }

        return className;
    }
}