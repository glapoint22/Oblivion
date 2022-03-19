import { NodeType } from "widgets";
import { Element } from "./element";
import { SelectedElement } from "./selected-element";

export class OrderedListElement extends Element {

    constructor() {
        super();
        this.nodeType = NodeType.Ol;
    }

    setSelectedElement(offset: number): SelectedElement {
        throw new Error("Method not implemented.");
    }
    onKeydown(key: string, offset: number): SelectedElement {
        throw new Error("Method not implemented.");
    }
    createHtml(parent: HTMLElement): void {
        const orderedListElement = document.createElement('ol');

        this.setHtmlElement(orderedListElement, parent);
    }


    createElement(): Element {
        return new OrderedListElement();
    }

    // copyElement(parent: Element): Element {
    //     const orderedListElement = new OrderedListElement();

    //     orderedListElement.parent = parent;
    //     orderedListElement.styles = this.styles;
    //     this.children.forEach((child: Element) => {
    //         orderedListElement.children.push(child.copyElement(orderedListElement));
    //     });

    //     return orderedListElement;
    // }

}