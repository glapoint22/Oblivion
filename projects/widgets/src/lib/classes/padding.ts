import { PaddingValue } from "./padding-value";
import { PaddingType } from "./widget-enums";

export class Padding {
    public constrain!: boolean;
    public values: Array<PaddingValue> = Array<PaddingValue>();

    constructor() {
        this.values.push(new PaddingValue(PaddingType.Top, 0));
        this.values.push(new PaddingValue(PaddingType.Right, 0));
        this.values.push(new PaddingValue(PaddingType.Bottom, 0));
        this.values.push(new PaddingValue(PaddingType.Left, 0));
    }

    setData(padding: Padding) {
        if (padding) {
            if (padding.values) this.values = padding.values;
        }
    }


    setClasses(element: HTMLElement) {
        // Get a list of all current padding classes
        const classes = element.className.match(/padding-[a-z\-]+[0-9]+[\-a-z]*/g);

        // Remove the padding classes
        classes?.forEach(x => {
            element.classList.remove(x);
        });

        // Add the new classes
        this.values.forEach((value: PaddingValue) => {
            if (value.padding > 0 || value.breakpoint) element.classList.add(value.paddingType + '-' + value.padding +
                (value.breakpoint ? '-' + value.breakpoint : ''));
        });
    }
}