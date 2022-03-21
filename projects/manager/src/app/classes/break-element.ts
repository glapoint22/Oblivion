import { NodeType } from "widgets";
import { Element } from "./element";
import { SelectedElement } from "./selected-element";

export class BreakElement extends Element {

    constructor(parent: Element) {
        super(parent);
        this.nodeType = NodeType.Br;
    }


    createHtml(parent: HTMLElement): void {
        const breakElement = document.createElement('br');

        this.setHtmlElement(breakElement, parent);
    }

    setSelectedElement(offset: number): SelectedElement {
        const container = this.getContainer();

        return container.setSelectedElement(0);
    }


    createElement(parent: Element): Element {
        return new BreakElement(parent);
    }
}