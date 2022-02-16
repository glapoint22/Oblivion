import { BreakpointType } from "./widget-enums";

export class Breakpoint {
    public breakpointType!: BreakpointType;
    public screenSize!: string;
    public value: any;
}