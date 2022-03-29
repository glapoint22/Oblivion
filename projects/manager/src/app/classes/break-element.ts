import { NodeType } from "widgets";
import { Element } from "./element";
import { TextSelection } from "./text-selection";
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

    setSelectedElement(offset: number): TextSelection {
        return this.container.setSelectedElement(0);
    }


    createElement(parent: Element): Element {
        return new BreakElement(parent);
    }


    onKeydown(key: string, offset: number): TextSelection {
        const textElement = new TextElement(this.parent, key);
        
        this.parent.children = [];
        this.parent.children.push(textElement);

        return textElement.setSelectedElement(1);
    }
}