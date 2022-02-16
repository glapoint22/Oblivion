import { Breakpoint } from "./breakpoint";
import { WidgetType } from "./widget-enums";

export class WidgetData {
    public width!: number;
    public height!: number;
    public horizontalAlignment!: string;
    public breakpoints!: Array<Breakpoint>;

    constructor(public widgetType: WidgetType) { }
}