import { Container } from "./container";
import { Element } from "./element";
import { ElementType } from "./element-type";

export class ListItemElement extends Container {


    constructor(public parent: Element) {
        super();
        this.elementType = ElementType.ListItem;
    }

    // ---------------------------------------------------Generate Html-----------------------------------------------------
    public generateHtml(parent: HTMLElement, isDev?: boolean): void {
        const listItemElement = document.createElement('li');

        this.setHtmlElement(listItemElement, parent, isDev!);
    }


    



    // ---------------------------------------------------Create-----------------------------------------------------
    public create(parent: Element): Element {
        return new ListItemElement(parent);
    }
}