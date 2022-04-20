import { NodeType } from "widgets";
import { Element } from "./element";
import { UnorderedListElement } from "./unordered-list-element";

export class OrderedListElement extends Element {

    constructor(parent: Element) {
        super(parent);
        this.nodeType = NodeType.Ol;
    }



    createHtml(parent: HTMLElement): void {
        const orderedListElement = document.createElement('ol');

        this.setHtmlElement(orderedListElement, parent);
    }




    createElement(parent: Element, changeType?: NodeType): Element {
        if (changeType == NodeType.Ul) {
            return new UnorderedListElement(parent);
        }

        return new OrderedListElement(parent);
    }
}