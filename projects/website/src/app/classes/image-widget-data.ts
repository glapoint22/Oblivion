import { Border } from "./border";
import { Corners } from "./corners";
import { Image } from "./image";
import { Link } from "./link";
import { Shadow } from "./shadow";
import { WidgetData } from "./widget-data";

export class ImageWidgetData extends WidgetData {
    public image!: Image;
    public border!: Border;
    public corners!: Corners;
    public shadow!: Shadow;
    public link!: Link;
}