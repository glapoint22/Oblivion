import { HorizontalAlignment } from "./horizontal-alignment";
import { WidgetType } from "./widget-enums";

export class WidgetData {
    public width!: number;
    public height!: number;
    public horizontalAlignment!: HorizontalAlignment;

    constructor(public widgetType: WidgetType) { }
}