import { NodeType } from "widgets";
import { Element } from "./element";
import { SelectedElement } from "./selected-element";

export class UnorderedListElement extends Element {

    constructor() {
        super();
        this.nodeType = NodeType.Ul;
    }


    setSelectedElement(offset: number): SelectedElement {
        throw new Error("Method not implemented.");
    }
    onKeydown(key: string, offset: number): SelectedElement {
        throw new Error("Method not implemented.");
    }
    createHtml(parent: HTMLElement): void {
        const unorderedListElement = document.createElement('ul');

        this.setHtmlElement(unorderedListElement, parent);
    }


    createElement(): Element {
        return new UnorderedListElement();
    }

    // copyElement(parent: Element): Element {
    //     const unorderedListElement = new UnorderedListElement();

    //     unorderedListElement.parent = parent;
    //     unorderedListElement.styles = this.styles;
    //     this.children.forEach((child: Element) => {
    //         const copiedElement = child.copyElement(unorderedListElement);

    //         if (copiedElement) unorderedListElement.children.push(copiedElement);
    //     });

    //     return unorderedListElement;
    // }

}