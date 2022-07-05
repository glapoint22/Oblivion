import { Breakpoint } from "./breakpoint";
import { BreakpointObject } from "./breakpoint-object";
import { PaddingValue } from "./padding-value";
import { PaddingType } from "./widget-enums";

export class Padding implements BreakpointObject {
    public values: Array<PaddingValue> = Array<PaddingValue>();
    public get breakpointOptions(): Array<any> {
        return [
            0,
            4,
            8,
            12,
            16,
            20,
            24,
            28,
            32,
            36,
            40,
            44,
            48
        ];
    }


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
                (value.breakpoint ? '-' + value.breakpoint : ''));
        });
    }


    getData(): Padding {
        if (this.values.length == 0) return null!;
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


    private getLabel(paddingType: PaddingType): string {
        let padding: string;

        switch (paddingType) {
            case 0:
                padding = 'Top'
                break;

            case 1:
                padding = 'Right'
                break;

            case 2:
                padding = 'Bottom'
                break;

            case 3:
                padding = 'Left'
                break;
        }

        return padding!;
    }



    getBreakpoints(): Array<Breakpoint> {
        for (let i = 0; i < 4; i++) {
            if (!this.values.some(x => x.paddingType == i)) this.values.push(new PaddingValue(i, 0));
        }

        // this.values = [];

        // this.values.push(new PaddingValue(1, 0, 0));
        // this.values.push(new PaddingValue(2, 4, 0));
        // this.values.push(new PaddingValue(0, 8, 5));
        // this.values.push(new PaddingValue(0, 12, 3));
        // this.values.push(new PaddingValue(2, 16, 5));
        // this.values.push(new PaddingValue(0, 4, 7));
        // this.values.push(new PaddingValue(3, 0, 0));
        // this.values.push(new PaddingValue(0, 40, 6));
        // this.values.push(new PaddingValue(3, 28, 1));
        // this.values.push(new PaddingValue(0, 0, 0));

        this.values = this.values.sort((a, b) => {
            if (a.paddingType > b.paddingType) {
                return 1;
            } else if (a.paddingType < b.paddingType) {
                return -1;
            }

            if (a.breakpoint! > b.breakpoint!) {
                return 1;
            } else if (a.breakpoint! < b.breakpoint!) {
                return -1;
            }

            return 0;
        });

        const breakpoints: Array<Breakpoint> = new Array<Breakpoint>();

        this.values.forEach((paddingValue: PaddingValue) => {
            const label = this.getLabel(paddingValue.paddingType);
            let breakpoint = breakpoints.find(x => x.label == label);

            if (!breakpoint) {
                // Create a new breakpoint
                breakpoints.push({
                    label: label,
                    values: [paddingValue]
                })
            } else {
                breakpoint.values.push(paddingValue);
            }
        });

        return breakpoints;
    }



    addBreakpoint(breakpoint: number): PaddingValue {
        let padding!: number;

        for (let i = this.values.length - 1; i > -1; i--) {
            const currentValue = this.values[i];

            if (currentValue.paddingType == PaddingType.Bottom && currentValue.breakpoint! < breakpoint) {
                padding = currentValue.padding;
                break;
            }
        }

        const paddingValue = new PaddingValue(PaddingType.Bottom, padding, breakpoint);
        this.values.push(paddingValue);

        return paddingValue;
    }

    deleteBreakpoint(value: PaddingValue): void {
        const index = this.values.findIndex(x => x == value);

        this.values.splice(index, 1);
        if(value.breakpoint == 0) {
            this.values[index].breakpoint = 0;
        }
    }
}