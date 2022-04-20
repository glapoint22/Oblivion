import { NodeType } from "widgets";
import { Element } from "./element";
import { OrderedListElement } from "./ordered-list-element";

export class UnorderedListElement extends Element {

    constructor(parent: Element) {
        super(parent);
        this.nodeType = NodeType.Ul;
    }


    createHtml(parent: HTMLElement): void {
        const unorderedListElement = document.createElement('ul');

        this.setHtmlElement(unorderedListElement, parent);
    }


    createElement(parent: Element, changeType?: NodeType): Element {
        if (changeType == NodeType.Ol) {
            return new OrderedListElement(parent);
        }

        return new UnorderedListElement(parent);
    }
}