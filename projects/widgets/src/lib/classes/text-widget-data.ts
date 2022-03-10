import { Background } from "./background";
import { Padding } from "./padding";
import { TextData } from "./text-data";
import { WidgetData } from "./widget-data";

export class TextWidgetData extends WidgetData {
    public textData!: Array<TextData>;
    public background!: Background;
    public padding!: Padding;
}