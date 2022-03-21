import { NodeType } from "widgets";
import { Element } from "./element";
import { SelectedElement } from "./selected-element";
import { TextElement } from "./text-element";

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


    onKeydown(key: string, offset: number): SelectedElement {
        const child = this.getFirstChild();
        const parent = child.parent;

        parent.children = [];
        parent.children.push(new TextElement(parent, key));

        return super.onKeydown(key, 1);
    }
}