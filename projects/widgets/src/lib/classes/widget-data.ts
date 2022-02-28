import { WidgetType } from "./widget-enums";

export class WidgetData {
    public width!: number;
    public height!: number;
    public horizontalAlignment!: string;

    constructor(public widgetType: WidgetType) { }
}