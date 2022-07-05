import { Breakpoint } from "./breakpoint";

export interface BreakpointObject {
    breakpointOptions: Array<any>;
    getBreakpoints(): Array<Breakpoint>;
    addBreakpoint(breakpoint: number, label?: string): any;
    deleteBreakpoint(value: any): void;
    canDelete(value: any): boolean;
    canAdd(breakpoint: number, label?: string): boolean;
}