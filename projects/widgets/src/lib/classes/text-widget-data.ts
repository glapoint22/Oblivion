import { TextBoxData } from "text-box";
import { Background } from "./background";
import { Padding } from "./padding";
import { WidgetData } from "./widget-data";

export class TextWidgetData extends WidgetData {
    public textBoxData!: Array<TextBoxData>;
    public background!: Background;
    public padding!: Padding;
}