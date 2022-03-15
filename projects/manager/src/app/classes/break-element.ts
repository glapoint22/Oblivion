import { NodeType } from "widgets";
import { Element } from "./element";
import { SelectedElement } from "./selected-element";

export class BreakElement extends Element {

    constructor() {
        super();
        this.nodeType = NodeType.Br;
    }

    onKeydown(key: string, offset: number): SelectedElement {
        throw new Error("Method not implemented.");
    }
    createHtml(parent: HTMLElement): void {
        const breakElement = document.createElement('br');

        parent.appendChild(breakElement);
    }

    setSelectedElement(offset: number): SelectedElement {
        return new SelectedElement(this.parent.id, 0);
    }


    createElement(): Element {
        return new BreakElement();
    }


    // copyElement(parent: Element): Element {
    //     const breakElement = new BreakElement();
    //     breakElement.parent = parent;

    //     return breakElement;
    // }
}