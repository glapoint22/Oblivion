import { Background } from "./background";
import { Row } from "./row";

export class PageContent {
    public background: Background = new Background();
    public rows: Array<Row> = new Array<Row>();

    setData(pageContent: PageContent) {
        if (pageContent) {
            if (pageContent.background) this.background.setData(pageContent.background);
            if (pageContent.rows) this.rows = pageContent.rows;
        }
    }
}