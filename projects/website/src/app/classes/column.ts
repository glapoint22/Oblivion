import { Background } from "./background";
import { Border } from "./border";
import { Breakpoint } from "./breakpoint";
import { Corners } from "./corners";
import { Padding } from "./padding";
import { Shadow } from "./shadow";
import { Widget } from "./widget";

export class Column {
    public width!: number;
    public widgetData!: Widget;
    public background!: Background;
    public border!: Border;
    public corners!: Corners;
    public shadow!: Shadow;
    public padding!: Padding;
    public columnSpan!: number;
    public breakpoints!: Array<Breakpoint>;
}