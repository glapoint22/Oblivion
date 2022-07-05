import { Breakpoint } from "./breakpoint";

export interface BreakpointObject {
    breakpointOptions: Array<any>;
    getBreakpoints(): Array<Breakpoint>;
    addBreakpoint(breakpoint: number): any;
    deleteBreakpoint(value: any): void;
}