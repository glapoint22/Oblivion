import { Element } from "./element";
import { SelectedElementOnDeletion } from "./enums";
import { SelectedElement } from "./selected-element";

export class TextElement extends Element {

    constructor(public text: string) { super() }

    create(parent: HTMLElement): void {
        const textElement = document.createTextNode(this.text);

        parent.appendChild(textElement);
    }


    onKeydown(key: string, offset: number): SelectedElement {
        if (key == 'Backspace') {
            


            this.text = this.text.substring(0, offset - 1) + this.text.substring(offset);
            offset = Math.max(0, offset - 1);

            if (this.text.substring(offset, offset - 1) == ' ') {
                this.text = this.text.substring(0, offset - 1) + '\u00A0' + this.text.substring(offset);
            } else if (this.text.length == 0) {
                const selectedChild = this.parent.deleteChild(this, SelectedElementOnDeletion.Previous);

                if (selectedChild) {
                    return selectedChild.setSelectedElement(Infinity);
                }
            } else if (offset == 0) {
                const element = this.getPreviousElement();

                if (element) {
                    return element.setSelectedElement(Infinity);
                }

            }
        } else if (key == 'Delete') {

            
            if (offset == this.text.length) {
                // if (this.isLastElement) {
                //     let a = 0;
                // } else {
                let element = this.getNextElement();

                if (element) {
                    return element.onKeydown(key, 0);
                    // }
                }

            } else {
                this.text = this.text.substring(0, offset) + this.text.substring(offset + 1);

                if (this.text.substring(0, 1) == ' ') {
                    this.text = '\u00A0' + this.text.substring(1);
                } else if (this.text.length == 0) {
                    // if (this.isLastElement){
                    //     let a = 0;
                    // }

                    const selectedChild = this.parent.deleteChild(this, SelectedElementOnDeletion.Next);

                    if (selectedChild) {
                        return selectedChild.setSelectedElement(0);
                    }

                }
            }


        } else {

            this.text = this.text.substring(0, offset) + key + this.text.substring(offset);
            offset++;
        }

        return this.setSelectedElement(offset);
    }


    setSelectedElement(offset: number): SelectedElement {
        if (offset == Infinity) {
            offset = this.text.length;

            if (this.text.substring(this.text.length - 1) == ' ') {
                this.text = this.text.substring(0, this.text.length - 1) + '\u00A0';
            }
        } else if (offset == 0 && this.text.substring(0, 1) == ' ') {
            this.text = '\u00A0' + this.text.substring(1);
        }

        const index = this.parent.children.findIndex(x => x == this);

        return new SelectedElement(this.parent.id, offset, index);
    }
}