import { Element } from "./element";
import { ElementType } from "./element-type";
import { Selection } from "./selection";

export class UnorderedListElement extends Element {
    

    constructor(public parent: Element) {
        super();
        this.elementType = ElementType.UnorderedList;
    }


    // ---------------------------------------------------Generate Html-----------------------------------------------------
    public generateHtml(parent: HTMLElement, isDev?: boolean): void {
        const unorderedListElement = document.createElement('ul');

        this.setHtmlElement(unorderedListElement, parent, isDev!);
    }



    // ---------------------------------------------------Create-----------------------------------------------------
    public create(parent: Element): Element {
        return new UnorderedListElement(parent);
    }
}