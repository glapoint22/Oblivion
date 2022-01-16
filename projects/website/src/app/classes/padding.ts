import { Breakpoint } from "./breakpoint";
import { BreakpointType } from "./enums";

export class Padding {
    public constrain!: boolean;
    public top!: string;
    public right!: string;
    public bottom!: string;
    public left!: string;

    constructor(padding: Padding) {
        if (padding) {
            this.constrain = padding.constrain;
            this.top = padding.top;
            this.right = padding.right;
            this.bottom = padding.bottom;
            this.left = padding.left;
        }
    }


    setClass(element: HTMLElement, breakpoints: Array<Breakpoint>,) {
        if (!breakpoints && (!this.top || !this.right || !this.bottom || !this.left)) return;

        let paddingTypes = [
            'PaddingTop',
            'PaddingRight',
            'PaddingBottom',
            'PaddingLeft'
        ];

        // Loop through each of the padding types
        paddingTypes.forEach((paddingType: string) => {
            let paddingBreakpoints: Array<Breakpoint> = [];


            if (breakpoints) paddingBreakpoints = breakpoints.filter(x => x.breakpointType == (<any>BreakpointType)[paddingType]);


            // If there any breakpoints for this padding type
            // Add the classes with the screen size
            if (paddingBreakpoints.length > 0) {
                paddingBreakpoints.forEach((breakpoint: Breakpoint) => {
                    element.classList.add(this.getClassName(breakpoint.breakpointType) + '-' +
                        breakpoint.value.substr(0, breakpoint.value.length - 2) +
                        '-' + breakpoint.screenSize.toLowerCase());
                });

                // There are no breakpoints for this padding type
                // Add the classes without the screen size
            } else if (this.top || this.right || this.bottom || this.left) {
                let paddingValue = (<any>this)[paddingType.substring(7).toLowerCase()];

                // Only add class if value is not zero
                if (paddingValue && paddingValue != '0px') {
                    element.classList.add(this.getClassName((<any>BreakpointType)[paddingType]) + '-' +
                        paddingValue.substr(0, paddingValue.length - 2));
                }
            }
        });
    }


    private getClassName(breakpointType: BreakpointType): string {
        let className: string = '';

        switch (breakpointType) {
            case BreakpointType.PaddingTop:
                className = 'padding-top';
                break;

            case BreakpointType.PaddingRight:
                className = 'padding-right';
                break;


            case BreakpointType.PaddingBottom:
                className = 'padding-bottom';
                break;

            case BreakpointType.PaddingLeft:
                className = 'padding-left';
                break;
        }

        return className;
    }
}