import { BreakElement } from "./break-element";
import { Element } from "./element";
import { SelectedElement } from "./selected-element";
import { TextElement } from "./text-element";

export class DivElement extends Element {

    create(parent: HTMLElement): void {
        const divElement = document.createElement('div');

        this.setHtmlElement(divElement, parent);
    }

    onKeydown(key: string, offset: number): SelectedElement {
        let selectedElement!: SelectedElement;

        // if (key == 'Backspace' || key == 'Delete') {
        //     return this.parent.deleteChild(this);
        // } else {
        //     const textElement = new TextElement(key);

        //     textElement.parent = this;
        //     this.children[0] = textElement;
        //     selectedElement = textElement.setSelectedElement(1);
        // }
        
        return selectedElement;
    }


    // deleteChild(child: Element): SelectedElement {
    //     if (this.children.length == 1 && !(child instanceof BreakElement)) {
    //         this.children[0] = new BreakElement();

    //         return this.setSelectedElement(0);
    //     }

    //     return super.deleteChild(child);
    // }


    setSelectedElement(offset: number): SelectedElement {
        if(this.children[0] instanceof BreakElement) {
            return new SelectedElement(this.id, 0);
        } else if (offset == 0) {
            return this.getFirstTextElement().setSelectedElement(offset);
        } else {
            return this.getLastTextElement().setSelectedElement(offset);
        }
    }
}