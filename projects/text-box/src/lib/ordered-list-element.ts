import { Element } from "./element";
import { ElementType } from "./element-type";

export class OrderedListElement extends Element {

    constructor(public parent: Element) {
        super();
        this.elementType = ElementType.OrderedList;
    }


    // ---------------------------------------------------Generate Html-----------------------------------------------------
    public generateHtml(parent: HTMLElement, includeId?: boolean): void {
        const orderedListElement = document.createElement('ol');

        this.setHtmlElement(orderedListElement, parent, includeId!);
    }



    // ---------------------------------------------------Create-----------------------------------------------------
    protected create(parent: Element): Element {
        return new OrderedListElement(parent);
    }
}