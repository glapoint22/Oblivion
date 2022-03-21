import { NodeType } from "widgets";
import { Element } from "./element";

export class OrderedListElement extends Element {

    constructor(parent: Element) {
        super(parent);
        this.nodeType = NodeType.Ol;
    }



    createHtml(parent: HTMLElement): void {
        const orderedListElement = document.createElement('ol');

        this.setHtmlElement(orderedListElement, parent);
    }




    createElement(parent: Element): Element {
        return new OrderedListElement(parent);
    }
}