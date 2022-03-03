import { VerticalAlignmentValue } from "./vertical-alignment-value";

export class VerticalAlignment {
    public values: Array<VerticalAlignmentValue> = [];

    setData(verticalAlignment: VerticalAlignment) {
        if (verticalAlignment) {
            if (verticalAlignment.values) this.values = verticalAlignment.values;
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
                element.classList.add(value.verticalAlignmentType + (value.breakpoint ? '-' + value.breakpoint : ''));
            });
        }
    }
}