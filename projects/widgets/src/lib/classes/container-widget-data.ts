import { Background } from "./background";
import { Border } from "./border";
import { Corners } from "./corners";
import { Padding } from "./padding";
import { Row } from "./row";
import { Shadow } from "./shadow";
import { WidgetData } from "./widget-data";

export class ContainerWidgetData extends WidgetData {
    public rows!: Array<Row>;
    public background!: Background;
    public border!: Border;
    public corners!: Corners;
    public shadow!: Shadow;
    public padding!: Padding;
}