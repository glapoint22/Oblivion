import { Element } from "./element";
import { SelectedElement } from "./selected-element";

export class SpanElement extends Element {

    create(parent: HTMLElement): void {
        const spanElement = document.createElement('span');

        this.setHtmlElement(spanElement, parent);
    }



    setSelectedElement(offset: number): SelectedElement {
        if (offset == 0) {
            return this.getFirstTextElement().setSelectedElement(offset);
        } else {
            return this.getLastTextElement().setSelectedElement(offset);
        }
    }


    onKeydown(key: string, offset: number): SelectedElement {
        let selectedElement!: SelectedElement;

        if (key == 'Delete') {
            const element = this.getFirstTextElement();

            selectedElement = element.onKeydown(key, offset);
        }

        return selectedElement;
    }
}