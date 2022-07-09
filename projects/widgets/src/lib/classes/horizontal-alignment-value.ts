import { BreakpointValue } from "./breakpoint-value";
import { HorizontalAlignmentType } from "./widget-enums";

export class HorizontalAlignmentValue implements BreakpointValue<string> {

    constructor(public horizontalAlignmentType: HorizontalAlignmentType, public breakpoint: number) { }

    getValue(): string {
        let value!: string;

        switch (this.horizontalAlignmentType) {
            case HorizontalAlignmentType.Left:
                value = 'align-left.png'
                break;

            case HorizontalAlignmentType.Center:
                value = 'align-center.png'
                break;

            case HorizontalAlignmentType.Right:
                value = 'align-right.png'
                break;

        }

        return value;
    }

    setValue(value: string): void {
        switch (value) {
            case 'align-left.png':
                this.horizontalAlignmentType = HorizontalAlignmentType.Left;
                break;

            case 'align-center.png':
                this.horizontalAlignmentType = HorizontalAlignmentType.Center;
                break;

            case 'align-right.png':
                this.horizontalAlignmentType = HorizontalAlignmentType.Right;
                break;
        }
    }
}