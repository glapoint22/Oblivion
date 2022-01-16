import { Border } from "./border";
import { Corners } from "./corners";
import { Shadow } from "./shadow";
import { Video } from "./video";
import { WidgetData } from "./widget-data";

export class VideoWidgetData extends WidgetData {
    public border!: Border;
    public corners!: Corners;
    public shadow!: Shadow;
    public video!: Video;
}