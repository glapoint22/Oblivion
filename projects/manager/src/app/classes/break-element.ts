import { NodeType } from "widgets";
import { Element } from "./element";
import { Selection } from "./selection";
import { TextElement } from "./text-element";

export class BreakElement extends Element {

    constructor(parent: Element) {
        super(parent);
        this.nodeType = NodeType.Br;
    }


    createHtml(parent: HTMLElement): void {
        const breakElement = document.createElement('br');

        breakElement.id = this.id;
        parent.appendChild(breakElement);
    }


    getStartSelection(offset?: number): Selection {
        return this.container.getStartSelection(0);
    }



    createElement(parent: Element): Element {
        return new BreakElement(parent);
    }


    onKeydown(key: string, offset: number): Selection {
        const textElement = new TextElement(this.parent, key);

        this.parent.children = [];
        this.parent.children.push(textElement);

        return textElement.getStartSelection(1);
    }
}