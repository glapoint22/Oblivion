import { NodeType } from "widgets";
import { Element } from "./element";

export class AnchorElement extends Element {

    constructor(parent: Element, public link: string) {
        super(parent);
        this.nodeType = NodeType.A;
    }

    createHtml(parent: HTMLElement): void {
        const anchorElement = document.createElement('a');

        anchorElement.href = this.link;
        anchorElement.target = '_blank';
        this.setHtmlElement(anchorElement, parent);
    }



    createElement(parent: Element): Element {
        return new AnchorElement(parent, this.link);
    }
}