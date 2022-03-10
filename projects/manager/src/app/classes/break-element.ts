import { Element } from "./element";
import { SelectedElement } from "./selected-element";

export class BreakElement extends Element {

    onKeydown(key: string, offset: number): SelectedElement {
        throw new Error("Method not implemented.");
    }
    create(parent: HTMLElement): void {
        const breakElement = document.createElement('br');

        parent.appendChild(breakElement);
    }

    setSelectedElement(offset: number): SelectedElement {
        return new SelectedElement(this.parent.id, 0);
    }
}