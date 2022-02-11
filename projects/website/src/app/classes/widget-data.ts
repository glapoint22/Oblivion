import { Breakpoint } from "./breakpoint";
import { WidgetType } from "./widget-enums";

export class WidgetData {
    public widgetType!: WidgetType;
    public width!: number;
    public height!: number;
    public horizontalAlignment!: string;
    public breakpoints!: Array<Breakpoint>;
}