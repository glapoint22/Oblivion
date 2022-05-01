import { Container } from "./container";
import { Element } from "./element";
import { ElementType } from "./element-type";
import { Selection } from "./selection";

export class ListItemElement extends Container {
    

    constructor(public parent: Element) {
        super();
        this.elementType = ElementType.ListItem;
    }

    // ---------------------------------------------------Generate Html-----------------------------------------------------
    public generateHtml(parent: HTMLElement, includeId?: boolean): void {
        const listItemElement = document.createElement('li');

        this.setHtmlElement(listItemElement, parent, includeId!);
    }



    // ---------------------------------------------------Create-----------------------------------------------------
    protected create(parent: Element): Element {
        return new ListItemElement(parent);
    }
}