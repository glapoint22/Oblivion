import { HorizontalAlignmentValue } from "./horizontal-alignment-value";
import { BreakpointType, HorizontalAlignmentType } from "./widget-enums";

export class HorizontalAlignment {
    public values: Array<HorizontalAlignmentValue> = [];

    setData(horizontalAlignment: HorizontalAlignment) {
        if (horizontalAlignment) {
            if (horizontalAlignment.values) {
                horizontalAlignment.values.forEach((value: HorizontalAlignmentValue) => {
                    this.values.push(new HorizontalAlignmentValue(value.horizontalAlignmentType, value.breakpoint));
                });
            }
        }
    }


    setClasses(element: HTMLElement) {
        // Get a list of all current horizontal align classes
        const classes = element.className.match(/horizontal-align-[a-z\-]*/g);

        // Remove the horizontal align classes
        classes?.forEach(x => {
            element.classList.remove(x);
        });

        // Add the new classes
        if (this.values && this.values.length > 0) {
            this.values.forEach((value: HorizontalAlignmentValue) => {
                element.classList.add(this.getHorizontalAlignment(value.horizontalAlignmentType) + (value.breakpoint ? '-' + BreakpointType[value.breakpoint] : ''));
            });
        }
    }



    getHorizontalAlignment(horizontalAlignmentType: HorizontalAlignmentType): string {
        let horizontalAlignment!: string;

        switch (horizontalAlignmentType) {
            case HorizontalAlignmentType.Left:
                horizontalAlignment = 'horizontal-align-left'
                break;

            case HorizontalAlignmentType.Center:
                horizontalAlignment = 'horizontal-align-center'
                break;

            case HorizontalAlignmentType.Right:
                horizontalAlignment = 'horizontal-align-right'
                break;
        }

        return horizontalAlignment;
    }




    getData(): HorizontalAlignment {
        if (this.values.length == 0) return null!;
        const horizontalAlignment = new HorizontalAlignment();

        horizontalAlignment.values = [];
        this.values.forEach((horizontalAlignmentValue: HorizontalAlignmentValue) => {
            const newHorizontalAlignmentValue = new HorizontalAlignmentValue(horizontalAlignmentValue.horizontalAlignmentType, horizontalAlignmentValue.breakpoint);
            horizontalAlignment.values.push(newHorizontalAlignmentValue);
        });

        return horizontalAlignment;
    }
}