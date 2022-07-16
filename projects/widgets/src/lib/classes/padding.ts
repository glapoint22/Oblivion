import { PaddingValue } from "./padding-value";
import { BreakpointType, PaddingType } from "./widget-enums";

export class Padding {
    public values: Array<PaddingValue> = Array<PaddingValue>();

    setData(padding: Padding) {
        if (padding) {
            if (padding.values) {
                padding.values.forEach((paddingValue: PaddingValue) => {
                    this.values.push(new PaddingValue(paddingValue.paddingType, paddingValue.padding, paddingValue.breakpoint));
                });
            }
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
            if (value.padding > 0 || value.breakpoint) element.classList.add(this.getPadding(value.paddingType) + '-' + value.padding +
                (value.breakpoint ? '-' + BreakpointType[value.breakpoint] : ''));
        });
    }


    getData(): Padding {
        if (this.values.length == 0 || this.values.every(x => x.padding == 0 && x.breakpoint == 0)) return null!;
        const padding = new Padding();

        padding.values = [];
        this.values.forEach((paddingValue: PaddingValue) => {
            padding.values.push(new PaddingValue(paddingValue.paddingType, paddingValue.padding, paddingValue.breakpoint));
        });

        return padding;
    }


    private getPadding(paddingType: PaddingType): string {
        let padding: string;

        switch (paddingType) {
            case 0:
                padding = 'padding-top'
                break;

            case 1:
                padding = 'padding-right'
                break;

            case 2:
                padding = 'padding-bottom'
                break;

            case 3:
                padding = 'padding-left'
                break;
        }

        return padding!;
    }
}