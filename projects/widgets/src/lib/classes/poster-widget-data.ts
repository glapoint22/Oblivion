import { Image, Link } from "common";
import { WidgetData } from "./widget-data";

export class PosterWidgetData extends WidgetData {
    public image: Image = new Image();
    public image2: Image = new Image();
    public link: Link = new Link();
}