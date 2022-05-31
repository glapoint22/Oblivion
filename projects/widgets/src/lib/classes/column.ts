import { Background } from "./background";
import { Border } from "./border";
import { ColumnSpan } from "./column-span";
import { Corners } from "./corners";
import { Padding } from "./padding";
import { Shadow } from "./shadow";
import { WidgetData } from "./widget-data";

export class Column {
    public background!: Background;
    public border!: Border;
    public corners!: Corners;
    public shadow!: Shadow;
    public padding!: Padding;
    public columnSpan!: ColumnSpan;

    constructor(columnSpan: number, public widgetData: WidgetData) {
        this.columnSpan = new ColumnSpan(columnSpan);
    }
}