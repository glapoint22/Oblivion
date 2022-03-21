import { NodeType } from "widgets";
import { Element } from "./element";

export class UnorderedListElement extends Element {

    constructor(parent: Element) {
        super(parent);
        this.nodeType = NodeType.Ul;
    }


    createHtml(parent: HTMLElement): void {
        const unorderedListElement = document.createElement('ul');

        this.setHtmlElement(unorderedListElement, parent);
    }


    createElement(parent: Element): Element {
        return new UnorderedListElement(parent);
    }
}