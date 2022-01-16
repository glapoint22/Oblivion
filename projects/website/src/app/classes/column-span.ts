import { Breakpoint } from "./breakpoint";
import { BreakpointType } from "./enums";

export class ColumnSpan {
    constructor(private value: number) { }

    setClass(element: HTMLElement, breakpoints: Array<Breakpoint>) {
        let columnSpanBreakpoints: Array<Breakpoint> = [];

        if (breakpoints) columnSpanBreakpoints = breakpoints.filter(x => x.breakpointType == BreakpointType.ColumnSpan);

        if (columnSpanBreakpoints.length > 0) {
            columnSpanBreakpoints.forEach((breakpoint: Breakpoint) => {
                element.classList.add('col-' + breakpoint.value + '-' + breakpoint.screenSize.toLowerCase());
            });
        } else if (this.value) {
            element.classList.add('col-' + this.value);
        }
    }
}