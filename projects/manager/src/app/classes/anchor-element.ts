import { Link, LinkOption, NodeType } from "widgets";
import { Element } from "./element";

export class AnchorElement extends Element {

    constructor(parent: Element, public link: Link) {
        super(parent);
        this.nodeType = NodeType.A;
    }

    createHtml(parent: HTMLElement): void {
        const anchorElement = document.createElement('a');

        if (this.link.selectedOption == LinkOption.WebAddress) {
            anchorElement.href = this.link.url;
            anchorElement.target = '_blank';
        } else {
            anchorElement.setAttribute('routerLink', this.link.url);
        }


        this.setHtmlElement(anchorElement, parent);
    }



    createElement(parent: Element): Element {
        return new AnchorElement(parent, this.link);
    }
}