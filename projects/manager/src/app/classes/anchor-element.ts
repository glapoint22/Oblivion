import { Element } from "./element";
import { SelectedElement } from "./selected-element";

export class AnchorElement extends Element {
    setSelectedElement(offset: number): SelectedElement {
        throw new Error("Method not implemented.");
    }
    
    public link!: string;

    create(parent: HTMLElement): void {
        const anchorElement = document.createElement('a');

        anchorElement.href = this.link;
        anchorElement.target = '_blank';
        this.setHtmlElement(anchorElement, parent);
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