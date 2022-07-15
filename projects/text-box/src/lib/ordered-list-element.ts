import { Element } from "./element";
import { ElementType } from "./element-type";
import { Selection } from "./selection";

export class OrderedListElement extends Element {
    

    constructor(public parent: Element) {
        super();
        this.elementType = ElementType.OrderedList;
    }


    // ---------------------------------------------------Generate Html-----------------------------------------------------
    public generateHtml(parent: HTMLElement, isDev?: boolean): void {
        const orderedListElement = document.createElement('ol');

        this.setHtmlElement(orderedListElement, parent, isDev!);
    }



    // ---------------------------------------------------Create-----------------------------------------------------
    public create(parent: Element): Element {
        return new OrderedListElement(parent);
    }
}