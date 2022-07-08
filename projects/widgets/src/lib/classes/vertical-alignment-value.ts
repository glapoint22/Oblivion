import { BreakpointValue } from "./breakpoint-value";
import { VerticalAlignmentType } from "./widget-enums";

export class VerticalAlignmentValue implements BreakpointValue<string> {

    constructor(public verticalAlignmentType: VerticalAlignmentType, public breakpoint: number) { }

    getValue(): string {
        let value!: string;

        switch (this.verticalAlignmentType) {
            case VerticalAlignmentType.Top:
                value = 'align-top.png'
                break;

            case VerticalAlignmentType.Middle:
                value = 'align-middle.png'
                break;

            case VerticalAlignmentType.Bottom:
                value = 'align-bottom.png'
                break;

        }

        return value;
    }

    setValue(value: string): void {
        switch (value) {
            case 'align-top.png':
                this.verticalAlignmentType = VerticalAlignmentType.Top;
                break;

            case 'align-middle.png':
                this.verticalAlignmentType = VerticalAlignmentType.Middle;
                break;

            case 'align-bottom.png':
                this.verticalAlignmentType = VerticalAlignmentType.Bottom;
                break;
        }
    }
}