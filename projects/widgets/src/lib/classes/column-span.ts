
export class ColumnSpan {
    constructor(public value: number = 12) { }

    setClass(element: HTMLElement) {
        // let columnSpanBreakpoints: Array<Breakpoint> = [];

        // if (breakpoints) columnSpanBreakpoints = breakpoints.filter(x => x.breakpointType == BreakpointType.ColumnSpan);

        // if (columnSpanBreakpoints.length > 0) {
        //     columnSpanBreakpoints.forEach((breakpoint: Breakpoint) => {
        //         element.classList.add('col-' + breakpoint.value + '-' + breakpoint.screenSize.toLowerCase());
        //     });
        // } else if (this.value) {
            element.classList.add('col-' + this.value);
        // }
    }
}