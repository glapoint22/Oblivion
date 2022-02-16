import { Border } from "./border";
import { Shadow } from "./shadow";
import { WidgetData } from "./widget-data";

export class LineWidgetData extends WidgetData {
    public border!: Border;
    public shadow!: Shadow;
}