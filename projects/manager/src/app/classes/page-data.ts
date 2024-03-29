import { PageContent, PageType } from "widgets";
import { EmailType } from "./enums";
import { Item } from "./item";

export class PageData {
    public id!: string;
    public name!: string;
    public pageType!: PageType;
    public content!: PageContent;
    public pageReferenceItems!: Array<Item>;
    public emailType!: EmailType;
}