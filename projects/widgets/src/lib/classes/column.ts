import { Background } from "./background";
import { Border } from "./border";
import { Breakpoint } from "./breakpoint";
import { Corners } from "./corners";
import { Padding } from "./padding";
import { Shadow } from "./shadow";
import { WidgetData } from "./widget-data";
import { WidgetType } from "./widget-enums";

export class Column {
    public width!: number;
    public widgetData!: WidgetData;
    public background!: Background;
    public border!: Border;
    public corners!: Corners;
    public shadow!: Shadow;
    public padding!: Padding;
    public columnSpan!: number;
    public breakpoints!: Array<Breakpoint>;

    constructor(widgetType: WidgetType) { 
        this.widgetData = new WidgetData(widgetType);
    }
}