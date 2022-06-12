import { Background } from "./background";
import { ColumnSpan } from "./column-span";
import { Row } from "./row";

export class PageContent {
    public background: Background = new Background();
    public rows: Array<Row> = new Array<Row>();

    toString(): string {
        return JSON.stringify(this, (key, value) => {
            if (
                (typeof value != 'number' && !value) ||
                (typeof value == 'object' && Object.values(value).length == 0) ||
                (value instanceof Background && !value.enabled) ||
                (value instanceof ColumnSpan && value.values.length == 1 && value.values[0].span == 12)
            ) {
                return undefined;
            } else {
                return value;
            }
        });
    }



    setData(pageContent: PageContent) {
        if (pageContent) {
            if (pageContent.background) this.background.setData(pageContent.background);
            if (pageContent.rows) this.rows = pageContent.rows;
        }
    }
}