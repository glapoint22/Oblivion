import { Link } from "common";
import { Background } from "./background";
import { Border } from "./border";
import { Caption } from "./caption";
import { Corners } from "./corners";
import { Padding } from "./padding";
import { Shadow } from "./shadow";
import { WidgetData } from "./widget-data";

export class ButtonWidgetData extends WidgetData {
    public background!: Background;
    public border!: Border;
    public caption!: Caption;
    public corners!: Corners;
    public shadow!: Shadow;
    public padding!: Padding;
    public link!: Link;
    public backgroundHoverColor!: string;
    public backgroundActiveColor!: string;
    public borderHoverColor!: string;
    public borderActiveColor!: string;
    public textHoverColor!: string;
    public textActiveColor!: string;
}