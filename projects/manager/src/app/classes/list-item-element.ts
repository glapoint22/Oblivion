import { NodeType } from "widgets";
import { Element } from "./element";

export class ListItemElement extends Element {

    constructor(parent: Element) {
        super(parent);
        this.nodeType = NodeType.Li;
    }



    createHtml(parent: HTMLElement): void {
        const listItemElement = document.createElement('li');

        this.setHtmlElement(listItemElement, parent);
    }


    createElement(parent: Element): Element {
        return new ListItemElement(parent);
    }
}