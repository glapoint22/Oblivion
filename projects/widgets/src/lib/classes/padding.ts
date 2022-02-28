import { PaddingValue } from "./padding-value";

export class Padding {
    public constrain!: boolean;
    public values: Array<PaddingValue> = []


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


        // if (this.top && (this.top.padding > 0 || this.top.breakpoint)) element.classList.add(this.top.paddingType + '-' + this.top.padding + (this.top.breakpoint ? '-' + this.top.breakpoint : ''));
        // if (this.right && (this.right.padding > 0 || this.right.breakpoint)) element.classList.add(this.right.paddingType + '-' + this.right.padding + (this.right.breakpoint ? '-' + this.right.breakpoint : ''));
        // if (this.bottom && (this.bottom.padding > 0 || this.bottom.breakpoint)) element.classList.add(this.bottom.paddingType + '-' + this.bottom.padding + (this.bottom.breakpoint ? '-' + this.bottom.breakpoint : ''));
        // if (this.left && (this.left.padding > 0 || this.left.breakpoint)) element.classList.add(this.left.paddingType + '-' + this.left.padding + (this.left.breakpoint ? '-' + this.left.breakpoint : ''));
    }
}