import { Background } from "./background";
import { Padding } from "./padding";
import { WidgetData } from "./widget-data";

export class TextWidgetData extends WidgetData {
    public background!: Background;
    public padding!: Padding;
    public htmlContent!: string;
}