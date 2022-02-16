import { Background } from "./background";
import { Row } from "./row";
import { WidgetType } from "./widget-enums";

export class PageContent {
    public background!: Background;
    public rows: Array<Row> = new Array<Row>();

    addWidget(widgetType: WidgetType, top: number) {
        this.rows.push(new Row(top, widgetType));
    }
}