import { VerticalAlignmentValue } from "./vertical-alignment-value";
import { BreakpointType, VerticalAlignmentType } from "./widget-enums";

export class VerticalAlignment {
    public values: Array<VerticalAlignmentValue> = [];

    setData(verticalAlignment: VerticalAlignment) {
        if (verticalAlignment) {
            if (verticalAlignment.values) {
                verticalAlignment.values.forEach((value: VerticalAlignmentValue) => {
                    this.values.push(new VerticalAlignmentValue(value.verticalAlignmentType, value.breakpoint));
                });
            }
        }
    }


    setClasses(element: HTMLElement) {
        // Get a list of all current vertical align classes
        const classes = element.className.match(/vertical-align-[a-z\-]*/g);

        // Remove the vertical align classes
        classes?.forEach(x => {
            element.classList.remove(x);
        });

        // Add the new classes
        if (this.values && this.values.length > 0) {
            this.values.forEach((value: VerticalAlignmentValue) => {
                element.classList.add(this.getVerticalAlignment(value.verticalAlignmentType) + (value.breakpoint ? '-' + BreakpointType[value.breakpoint] : ''));
            });
        }
    }


    getVerticalAlignment(verticalAlignmentType: VerticalAlignmentType): string {
        let verticalAlignment!: string;

        switch (verticalAlignmentType) {
            case VerticalAlignmentType.Top:
                verticalAlignment = 'vertical-align-top'
                break;

            case VerticalAlignmentType.Middle:
                verticalAlignment = 'vertical-align-middle'
                break;

            case VerticalAlignmentType.Bottom:
                verticalAlignment = 'vertical-align-bottom'
                break;
        }

        return verticalAlignment;
    }


    getData(): VerticalAlignment {
        if (this.values.length == 0 || this.values.every(x => x.verticalAlignmentType == 0 && x.breakpoint == 0)) return null!;
        const verticalAlignment = new VerticalAlignment();

        verticalAlignment.values = [];
        this.values.forEach((verticalAlignmentValue: VerticalAlignmentValue) => {
            const newVerticalAlignmentValue = new VerticalAlignmentValue(verticalAlignmentValue.verticalAlignmentType, verticalAlignmentValue.breakpoint);

            verticalAlignment.values.push(newVerticalAlignmentValue);
        });

        return verticalAlignment;
    }

}