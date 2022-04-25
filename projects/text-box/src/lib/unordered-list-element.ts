import { Element } from "./element";
import { ElementType } from "./element-type";

export class UnorderedListElement extends Element {

    constructor(public parent: Element) {
        super();
        this.elementType = ElementType.UnorderedList;
    }


    // ---------------------------------------------------Generate Html-----------------------------------------------------
    public generateHtml(parent: HTMLElement, includeId?: boolean): void {
        const unorderedListElement = document.createElement('ul');

        this.setHtmlElement(unorderedListElement, parent, includeId!);
    }



    // ---------------------------------------------------Create-----------------------------------------------------
    protected create(parent: Element): Element {
        return new UnorderedListElement(parent);
    }
}