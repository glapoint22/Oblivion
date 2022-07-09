import { BreakpointValue } from "./breakpoint-value";

export class ColumnSpanValue implements BreakpointValue<number> {

    constructor(public span: number, public breakpoint: number) { }

    getValue(): number {
        return this.span;
    }
    setValue(value: number): void {
        this.span = value;
    }
}