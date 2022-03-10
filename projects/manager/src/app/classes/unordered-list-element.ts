import { Element } from "./element";
import { SelectedElement } from "./selected-element";

export class UnorderedListElement extends Element {
    setSelectedElement(offset: number): SelectedElement {
        throw new Error("Method not implemented.");
    }
    onKeydown(key: string, offset: number): SelectedElement {
        throw new Error("Method not implemented.");
    }
    create(parent: HTMLElement): void {
        const unorderedListElement = document.createElement('ul');

        this.setHtmlElement(unorderedListElement, parent);
    }
    
}