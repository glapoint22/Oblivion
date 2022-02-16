import { Background } from "./background";
import { Border } from "./border";
import { Breakpoint } from "./breakpoint";
import { Column } from "./column";
import { Corners } from "./corners";
import { Padding } from "./padding";
import { Shadow } from "./shadow";
import { WidgetType } from "./widget-enums";

export class Row {
    public columns: Array<Column> = new Array<Column>();
    public top!: number;
    public background!: Background;
    public border!: Border;
    public corners!: Corners;
    public shadow!: Shadow;
    public padding!: Padding;
    public verticalAlignment!: string;
    public breakpoints!: Array<Breakpoint>;

    constructor(top: number, widgetType: WidgetType) {
        this.top = top;
        this.columns.push(new Column(widgetType));
    }
}