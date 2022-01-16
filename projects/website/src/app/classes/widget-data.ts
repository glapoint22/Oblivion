import { Breakpoint } from "./breakpoint";
import { WidgetType } from "./enums";

export class WidgetData {
    public widgetType!: WidgetType;
    public width!: number;
    public height!: number;
    public horizontalAlignment!: string;
    public breakpoints!: Array<Breakpoint>;
}