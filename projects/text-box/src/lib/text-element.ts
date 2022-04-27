import { BreakElement } from "./break-element";
import { Element } from "./element";
import { ElementDeleteStatus } from "./element-delete-status";
import { ElementRange } from "./element-range";
import { ElementType } from "./element-type";

export class TextElement extends Element {

    constructor(public parent: Element, public text: string) {
        super();
        this.elementType = ElementType.Text;
    }


    // ---------------------------------------------------Generate Html-----------------------------------------------------
    public generateHtml(parent: HTMLElement, includeId?: boolean): void {
        const text = includeId ? this.text.replace(/\s/g, '\u00A0') : this.text;
        const textNode = document.createTextNode(text);

        parent.appendChild(textNode);
    }




    // ---------------------------------------------------Create-----------------------------------------------------
    protected create(parent: Element): Element {
        return new TextElement(parent, this.text);
    }




    // ---------------------------------------------------Delete-----------------------------------------------------
    public delete(startOffset?: number, endOffset?: number): ElementDeleteStatus {
        // Delete this element
        if (!startOffset && !endOffset) {
            return super.delete();
        }

        // Set the text
        this.text = this.text.substring(startOffset!, endOffset);

        // If we have no text, delete this element
        if (this.text.length == 0) return super.delete();

        return ElementDeleteStatus.NotDeleted
    }




    // ---------------------------------------------------Copy-----------------------------------------------------
    public copy(parent: Element, range?: ElementRange): Element {
        let text = this.text;
        let textElement: TextElement;

        if (range && range.startElementId == this.id) {
            range.inRange = true;
            text = text.substring(range.startOffset, range.startElementId == range.endElementId ? range.endOffset : undefined);
        } else if (range && range.endElementId == this.id) {
            text = text.substring(0, range.endOffset);
        }

        if (!range || range.inRange) {
            if (range?.endElementId == this.id) {
                range.inRange = false;

                if (text.length == 0) {
                    const breakElement = new BreakElement(parent);
                    return breakElement;
                }
            }

            textElement = new TextElement(parent, text);
        }

        return textElement!;
    }




    // ---------------------------------------------------Move To-----------------------------------------------------
    public moveTo(container: Element) {
        let topElement: Element = this;

        while (topElement.parent.elementType != ElementType.Div && topElement.parent.elementType != ElementType.ListItem) {
            topElement = topElement.parent;
        }

        const copy = topElement.copy(container);

        container.children.push(copy);
        topElement.delete();
    }



    // ---------------------------------------------------On Text Input-----------------------------------------------------
    public onTextInput(text: string, offset: number): void {
        this.text = this.text.substring(0, offset) + text + this.text.substring(offset);
    }



    // ---------------------------------------------------On Backspace Keydown-----------------------------------------------------
    public onBackspaceKeydown(offset: number): void {
        // Move to previous container if offset is zero and this is the first text element in the container
        if (offset == 0 && this == this.container.firstChild) {
            const previousChild = this.previousChild;

            if (previousChild) {
                const previousContainer = previousChild.container;

                // If previous child is a break element, remove from container
                if (previousChild.elementType == ElementType.Break) {
                    previousContainer.preserve = true;
                    previousChild.delete();
                }

                this.moveTo(previousContainer);
            }
        } else {
            // Remove the previous character
            this.text = this.text.substring(0, offset - 1) + this.text.substring(offset);
            if (this.text.length == 0) this.delete();
        }
    }



    // ---------------------------------------------------On Delete keydown-----------------------------------------------------
    public onDeleteKeydown(offset: number): void {
        if (offset == this.text.length) {
            const nextElement = this.nextChild;

            if (nextElement) {

                // If the next element is in a different container
                if (this.container != nextElement.container) {

                    // If the next element is a break element, delete it
                    if (nextElement.elementType == ElementType.Break) {
                        nextElement.delete();
                    } else {
                        // Move the next container's elements into this container
                        nextElement.container.moveTo(this.container);
                    }

                } else {
                    // Delete the next element
                    nextElement.onDeleteKeydown(0);
                }
            }
        } else {
            // Remove the next character
            this.text = this.text.substring(0, offset) + this.text.substring(offset + 1);
            if (this.text.length == 0) this.delete();
        }
    }




    // ---------------------------------------------------On Enter keydown-----------------------------------------------------
    public onEnterKeydown(offset: number): void {
        const container = this.container;
        const lastChild = container.lastChild;
        const index = container.index;
        const startRange = new ElementRange();
        const endRange = new ElementRange();

        // If the cursor is at the very end of the container
        if (this == lastChild && offset == this.text.length) {
            startRange.startElementId = this.id;
            startRange.startOffset = offset;
            startRange.endElementId = this.id

            const copy = container.copy(container.parent, startRange);
            container.parent.children.splice(index + 1, 0, copy);
        } else {
            startRange.startElementId = container.id;
            startRange.endElementId = this.id;
            startRange.endOffset = offset;
            const startCopy = container.copy(container.parent, startRange);

            endRange.startElementId = offset == this.text.length ? this.nextChild?.id! : this.id;
            endRange.startOffset = offset == this.text.length ? 0 : offset;
            endRange.endElementId = lastChild.id;
            endRange.endOffset = (lastChild as TextElement).text.length;
            const endCopy = container.copy(container.parent, endRange);

            container.parent.children.splice(index, 1, startCopy);
            container.parent.children.splice(index + 1, 0, endCopy);
        }
    }
}