import { Background } from "./background";
import { Row } from "./row";
import { PageType } from "./widget-enums";

export class PageContent {
    public pageType: PageType = PageType.Custom;
    public name!: string;
    public background!: Background;
    public rows: Array<Row> = new Array<Row>();
}