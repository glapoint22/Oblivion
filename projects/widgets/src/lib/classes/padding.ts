import { PaddingValue } from "./padding-value";

export class Padding {
    public constrain!: boolean;
    public values: Array<PaddingValue> = Array<PaddingValue>();

    setData(padding: Padding) {
        if (padding) {
            if (padding.values) this.values = padding.values;
            if (padding.constrain) this.constrain = padding.constrain;
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


    getData(): Padding {
        if (this.values.length == 0) return null!;
        const padding = new Padding();

        padding.constrain = this.constrain;
        padding.values = [];
        this.values.forEach((paddingValue: PaddingValue) => {
            padding.values.push(new PaddingValue(paddingValue.paddingType, paddingValue.padding, paddingValue.breakpoint));
        });

        return padding;
    }
}