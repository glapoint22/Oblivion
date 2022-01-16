import { Breakpoint } from "./breakpoint";
import { BreakpointType, VerticalAlign } from "./enums";

export class VerticalAlignment {

    constructor(private value: string) { }

    setClass(element: HTMLElement, breakpoints: Array<Breakpoint>) {
        if (!breakpoints && !this.value) return;

        let verticalAlignmentBreakpoints: Array<Breakpoint> = [];

        if (breakpoints) verticalAlignmentBreakpoints = breakpoints.filter(x => x.breakpointType == BreakpointType.VerticalAlignment);

        // If there are any breakpoints, add each breakpoint class 
        if (verticalAlignmentBreakpoints.length > 0) {
            verticalAlignmentBreakpoints.forEach((breakpoint: Breakpoint) => {
                element.classList.add(this.getClassName(breakpoint.value) + '-' + breakpoint.screenSize.toLowerCase());
            });

            // We have no breakpoints, add a single class
        } else if (this.value) {
            if (this.value != VerticalAlign.Top) element.classList.add(this.getClassName(this.value));
        }
    }



    private getClassName(value: string): string {
        let className: string = '';

        switch (value) {
            case VerticalAlign.Top:
                className = 'vertical-align-top';
                break;

            case VerticalAlign.Middle:
                className = 'vertical-align-middle';
                break;

            case VerticalAlign.Bottom:
                className = 'vertical-align-bottom';
                break;
        }

        return className;
    }
}