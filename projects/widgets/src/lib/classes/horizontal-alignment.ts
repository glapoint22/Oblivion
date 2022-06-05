import { HorizontalAlignmentValue } from "./horizontal-alignment-value";

export class HorizontalAlignment {
    public values: Array<HorizontalAlignmentValue> = [];

    setData(horizontalAlignment: HorizontalAlignment) {
        if (horizontalAlignment) {
            if (horizontalAlignment.values) this.values = horizontalAlignment.values;
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
                element.classList.add(value.horizontalAlignmentType + (value.breakpoint ? '-' + value.breakpoint : ''));
            });
        }
    }




    getData(): HorizontalAlignment {
        if (this.values.length == 0) return null!;
        const horizontalAlignment = new HorizontalAlignment();

        horizontalAlignment.values = [];
        this.values.forEach((horizontalAlignmentValue: HorizontalAlignmentValue) => {
            const newHorizontalAlignmentValue = new HorizontalAlignmentValue();

            newHorizontalAlignmentValue.horizontalAlignmentType = horizontalAlignmentValue.horizontalAlignmentType;
            newHorizontalAlignmentValue.breakpoint = horizontalAlignmentValue.breakpoint;

            horizontalAlignment.values.push(newHorizontalAlignmentValue);
        });

        return horizontalAlignment;
    }
}