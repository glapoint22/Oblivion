import { BreakpointValue } from "./breakpoint-value";
import { PaddingType } from "./widget-enums";

export class PaddingValue implements BreakpointValue<number> {

    constructor(public paddingType: PaddingType, public padding: number, public breakpoint?: number) { }

    getValue(): number {
        return this.padding;
    }

    setValue(value: number): void {
        this.padding = value;
    }
}