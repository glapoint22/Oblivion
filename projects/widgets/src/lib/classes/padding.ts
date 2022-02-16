import { Breakpoint } from "./breakpoint";
import { BreakpointType } from "./widget-enums";

export class Padding {
    public constrain: boolean = true;
    public top: string = '0px';
    public right: string = '0px';
    public bottom: string = '0px';
    public left: string = '0px';

    setData(padding: Padding) {
        if (padding) {
            if (padding.constrain) this.constrain = padding.constrain;
            if (padding.top) this.top = padding.top;
            if (padding.right) this.right = padding.right;
            if (padding.bottom) this.bottom = padding.bottom;
            if (padding.left) this.left = padding.left;
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