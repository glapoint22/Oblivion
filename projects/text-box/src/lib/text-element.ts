import { Container } from "./container";
import { Element } from "./element";
import { ElementDeleteStatus } from "./element-delete-status";
import { ElementRange } from "./element-range";
import { ElementType } from "./element-type";
import { Selection } from "./selection";

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
        this.text = this.text.substring(startOffset!, endOffset == Infinity ? this.text.length : endOffset);

        // If we have no text, delete this element
        if (this.text.length == 0) return super.delete();

        return ElementDeleteStatus.NotDeleted
    }




    // ---------------------------------------------------Copy-----------------------------------------------------
    public copy(parent: Element, selection: Selection, range?: ElementRange): Element {
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
                    return textElement!;
                }
            }

            textElement = new TextElement(parent, text);

            // Reset the selection elements
            if (selection.startElement == this) selection.startElement = textElement;
            if (selection.endElement == this) selection.endElement = textElement;
        }

        return textElement!;
    }




    // ---------------------------------------------------Move To-----------------------------------------------------
    public moveTo(container: Element, selection: Selection) {
        let topElement: Element = this;

        while (topElement.parent.elementType != ElementType.Div && topElement.parent.elementType != ElementType.ListItem) {
            topElement = topElement.parent;
        }

        const copy = topElement.copy(container, selection);

        container.children.push(copy);
        topElement.delete();
    }



    // ---------------------------------------------------On Text Input-----------------------------------------------------
    public onTextInput(text: string, selection: Selection): void {
        this.text = this.text.substring(0, selection.startOffset) + text + this.text.substring(selection.startOffset);
        this.setSelection(selection, selection.startOffset + text.length);
    }



    // ---------------------------------------------------On Backspace Keydown-----------------------------------------------------
    public onBackspaceKeydown(selection: Selection): void {
        // Move to previous container if offset is zero and this is the first text element in the container
        if (selection.startOffset == 0 && this == this.container.firstChild) {
            const previousChild = this.previousChild;

            if (previousChild) {
                const previousContainer = previousChild.container;

                // If previous child is a break element, remove from container
                if (previousChild.elementType == ElementType.Break) {
                    previousContainer.preserve = true;
                    previousChild.delete();
                } else {
                    previousChild.setSelection(selection, Infinity);
                }

                this.container.moveTo(previousContainer, selection);
            }
        } else {
            // Remove the previous character
            this.text = this.text.substring(0, selection.startOffset - 1) + this.text.substring(selection.startOffset);


            // If we have empty text
            if (this.text.length == 0) {
                const previousChild = this.previousChild;
                const nextChild = this.nextChild;
                const container = this.container as Container;

                // If the container is down to one child
                if (container.children.length == 1) {
                    container.preserve = true;
                }

                // Delete this text element
                this.delete();

                // If this container has no more children, create a break element
                if (container.children.length == 0) {
                    container.createBreakElement();
                    container.setSelection(selection);
                } else {
                    // Select the previous child
                    if (previousChild) {
                        previousChild.setSelection(selection, Infinity);

                        // Select the next child
                    } else {
                        nextChild?.setSelection(selection);
                    }
                }


            } else {
                let offset = selection.startOffset - 1;
                let element: Element = this;
                const previousChild = this.previousChild;

                // If we are at the beginning of the text, select the previous child
                if (offset == 0 && previousChild) {
                    offset = Infinity;
                    element = previousChild;
                }

                element.setSelection(selection, offset);
            }
        }
    }



    // ---------------------------------------------------On Delete keydown-----------------------------------------------------
    public onDeleteKeydown(selection: Selection): void {
        if (selection.startOffset == this.text.length) {
            const nextElement = this.nextChild;

            if (nextElement) {

                // If the next element is in a different container
                if (this.container != nextElement.container) {

                    // If the next element is a break element, delete it
                    if (nextElement.elementType == ElementType.Break) {
                        nextElement.delete();
                    } else {
                        // Move the next container's elements into this container
                        nextElement.container.moveTo(this.container, selection);
                    }

                } else {
                    // Delete the next element
                    nextElement.delete(1, Infinity);
                }
            }
        } else {
            // Remove the next character
            this.text = this.text.substring(0, selection.startOffset) + this.text.substring(selection.startOffset + 1);

            // If we have an empty string
            if (this.text.length == 0) {
                let nextChild = this.nextChild;
                const container = this.container as Container;
                const nextContainer = nextChild?.container;

                // If the next child is in a different container
                if (container != nextContainer) {
                    container.preserve = true;
                }

                // Delete this text element
                this.delete();

                // If this container has no more children, create a break element
                if (container.children.length == 0) {
                    container.createBreakElement();
                    nextChild = container;
                }

                nextChild?.setSelection(selection);
            }
        }
    }




    // ---------------------------------------------------On Enter keydown-----------------------------------------------------
    public onEnterKeydown(selection: Selection): void {
        const container = this.container;
        const firstChild = this.container.firstChild;
        const lastChild = container.lastChild;
        const index = container.index;
        const startRange = new ElementRange();
        const endRange = new ElementRange();

        // If the cursor is at the end
        if (this == lastChild && selection.startOffset == this.text.length) {
            startRange.startElementId = this.id;
            startRange.startOffset = selection.startOffset;
            startRange.endElementId = this.id

            const containerCopy = container.copy(container.parent, selection, startRange) as Container;
            containerCopy.createBreakElement();
            container.parent.children.splice(index + 1, 0, containerCopy);

            containerCopy.firstChild.parent.setSelection(selection);

            // If cursor is at the beginning
        } else if (this == firstChild && selection.startOffset == 0) {
            startRange.startElementId = container.id;
            startRange.endElementId = this.id;
            startRange.startOffset = 0;
            startRange.endOffset = 0;

            const containerCopy = container.copy(container.parent, selection, startRange) as Container;
            containerCopy.createBreakElement();
            container.parent.children.splice(index, 0, containerCopy);

            this.setSelection(selection);

            // Other
        } else {
            startRange.startElementId = container.id;
            startRange.endElementId = this.id;
            startRange.endOffset = selection.startOffset;
            const startCopy = container.copy(container.parent, selection, startRange);

            const startElement = selection.startOffset == this.text.length ? this.nextChild : this;
            selection.startElement = selection.endElement = startElement!;

            endRange.startElementId = startElement?.id!;
            endRange.startOffset = selection.startOffset == this.text.length ? 0 : selection.startOffset;
            endRange.endElementId = lastChild.id;
            endRange.endOffset = (lastChild as TextElement).text.length;

            const endCopy = container.copy(container.parent, selection, endRange);


            container.parent.children.splice(index, 1, startCopy);
            container.parent.children.splice(index + 1, 0, endCopy);

            selection.startElement.setSelection(selection);
        }
    }


    // ---------------------------------------------------Set Selection-----------------------------------------------------
    public setSelection(selection: Selection, offset?: number): void {
        selection.startElement = selection.endElement = this;
        selection.startChildIndex = selection.endChildIndex = this.index;
        selection.startOffset = selection.endOffset = offset ? offset == Infinity ? this.text.length : offset : 0;
    }

}