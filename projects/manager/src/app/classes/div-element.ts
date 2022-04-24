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

        if (this.indent > 0) divElement.style.textIndent = (this.indent * 40) + 20 + 'px';
        this.setHtmlElement(divElement, parent);
    }

    setIndent(value: number) {
        this.indent = Math.max(0, this.indent + value);
    }
}