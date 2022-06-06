import { WidgetType } from "./widget-enums";

export class WidgetData {
    public width!: number;
    public height!: number;

    constructor(public widgetType: WidgetType) { }
}