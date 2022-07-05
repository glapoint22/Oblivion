import { Breakpoint } from "./breakpoint";
import { BreakpointObject } from "./breakpoint-object";
import { PaddingValue } from "./padding-value";
import { BreakpointType, PaddingType } from "./widget-enums";

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
                (value.breakpoint ? '-' + BreakpointType[value.breakpoint] : ''));
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


    private getPaddingType(label: string): number {
        let paddingType: PaddingType;

        switch (label) {
            case 'Top':
                paddingType = PaddingType.Top
                break;

            case 'Right':
                paddingType = PaddingType.Right
                break;

            case 'Bottom':
                paddingType = PaddingType.Bottom
                break;

            case 'Left':
                paddingType = PaddingType.Left
                break;
        }

        return paddingType!;
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



    addBreakpoint(breakpoint: number, label: string): PaddingValue {
        let padding!: number;
        const paddingType = this.getPaddingType(label);

        for (let i = this.values.length - 1; i > -1; i--) {
            const currentValue = this.values[i];

            if (currentValue.paddingType == paddingType && currentValue.breakpoint! < breakpoint) {
                padding = currentValue.padding;
                break;
            }
        }

        const paddingValue = new PaddingValue(paddingType, padding, breakpoint);
        this.values.push(paddingValue);

        return paddingValue;
    }



    deleteBreakpoint(value: PaddingValue): void {
        const index = this.values.findIndex(x => x == value);

        this.values.splice(index, 1);
        if (value.breakpoint == 0) {
            this.values[index].breakpoint = 0;
        }
    }


    canDelete(value: PaddingValue): boolean {
        return this.values.filter(x => x.paddingType == value.paddingType).length > 1;
    }


    canAdd(breakpoint: number, label: string): boolean {
        return !this.values.some(x => x.breakpoint == breakpoint && x.paddingType == this.getPaddingType(label));
    }
}