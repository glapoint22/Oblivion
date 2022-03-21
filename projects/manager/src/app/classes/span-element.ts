import { NodeType } from "widgets";
import { Element } from "./element";

export class SpanElement extends Element {

    constructor(parent: Element) {
        super(parent);
        this.nodeType = NodeType.Span;
    }

    createHtml(parent: HTMLElement): void {
        const spanElement = document.createElement('span');

        this.setHtmlElement(spanElement, parent);
    }


    createElement(parent: Element): Element {
        return new SpanElement(parent);
    }
}