import { NodeType } from "widgets";
import { Element } from "./element";

export class DivElement extends Element {

    constructor(parent: Element) {
        super(parent);
        this.nodeType = NodeType.Div;
    }


    createElement(parent: Element): Element {
        return new DivElement(parent);
    }


    createHtml(parent: HTMLElement): void {
        const divElement = document.createElement('div');

        this.setHtmlElement(divElement, parent);
    }
}