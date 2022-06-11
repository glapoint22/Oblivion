import { PageContent, PageType } from "widgets";
import { Item } from "./item";

export class PageData {
    public id!: number;
        public name!: string;
        public pageType!: PageType;
        public content!: PageContent;
        public pageReferenceItems!: Array<Item>;
}