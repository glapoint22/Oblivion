import { NodeType } from "widgets";
import { BreakElement } from "./break-element";
import { ElementRange } from "./element-range";
import { Element } from "./element";
import { SelectedElementOnDeletion } from "./enums";
import { Selection } from "./selection";
import { CopyElementOptions } from "./copy-element-options";

export class TextElement extends Element {

    constructor(parent: Element, public text: string) {
        super(parent);
        this.nodeType = NodeType.Text;
    }



    // ---------------------------------------------------Create-----------------------------------------------------
    createHtml(parent: HTMLElement): void {
        const text = this.text.replace(/\s/g, '\u00A0');
        const textElement = document.createTextNode(text);

        parent.appendChild(textElement);
    }






    // ---------------------------------------------------On Backspace-----------------------------------------------------
    onBackspace(offset: number): Selection {
        // Remove the previous character
        this.text = this.text.substring(0, offset - 1) + this.text.substring(offset);
        offset--;

        // If offset is -1, we have to move the text to the previous line
        if (offset == -1) {
            const previousChild = this.previousChild;

            if (previousChild) {
                const currentContainer = this.container;
                const previousContainer = previousChild.container;
                const previousContainerLastChild = previousContainer.lastChild;

                // Move each element from the current container into the previous container
                currentContainer.children.forEach((element: Element) => {
                    const copiedElement = element.copyElement(previousContainer);

                    if (copiedElement) previousContainer.children.push(copiedElement);
                });

                // Delete the current container
                currentContainer.parent.deleteChild(currentContainer);


                // If the previous container's last child is a break element, we need to delete it
                if (previousContainerLastChild.nodeType == NodeType.Br) {
                    const selectedElement = previousContainer.deleteChild(previousContainerLastChild.topParent, { selectedChildOnDeletion: SelectedElementOnDeletion.Next });

                    if (selectedElement) return selectedElement.getStartSelection();

                } else {
                    return previousContainerLastChild.getStartSelection(Infinity);
                }
            } else {
                offset = 0;
            }





            // Cursor is at start of the text
        } else if (offset == 0) {
            const container = this.container;
            const topParent = this.topParent;

            // Test to see if we are at the start of the container
            if (container.children[0] == topParent && topParent.firstChild == this) {

                // If we have no text
                if (this.text.length == 0) {
                    // Delete this text element
                    const selectedElement = this.parent.deleteChild(this, {
                        selectedChildOnDeletion: SelectedElementOnDeletion.Next,
                        preserveContainer: true
                    });

                    // If this container has no children, create a break element inside of the container
                    if (container.children.length == 0) {
                        container.children.push(new BreakElement(container));
                        return container.getStartSelection(offset);
                    } else {

                        // we have children remaining...Set the cursor on the next sibling
                        if (selectedElement) return selectedElement.getStartSelection();
                    }
                }

                // We are NOT at the start of the container
            } else {
                // If we have no text left...Delete this text element and place cursor at previous sibling
                if (this.text.length == 0) {
                    const previousChild = this.parent.deleteChild(this, { selectedChildOnDeletion: SelectedElementOnDeletion.Previous });

                    if (previousChild) return previousChild.getStartSelection(Infinity);
                } else {
                    // place cursor at previous child
                    const previousChild = this.previousChild;

                    if (previousChild) {
                        return previousChild.getStartSelection(Infinity);
                    }
                }
            }
        }

        return this.getStartSelection(offset);
    }




    // --------------------------------------------------On Delete-----------------------------------------------------
    onDelete(offset: number): Selection {

        // If the cursor is at the end of the text
        if (offset == this.text.length) {
            // Get the next element
            let nextElement = this.nextChild;

            if (nextElement) {

                // Get this container and the other container the next element is in
                const currentContainer = this.container;
                const otherContainer = nextElement.container;

                // If the other container is not this container
                if (currentContainer != otherContainer) {

                    // If the first child in the other container is not a break element
                    if (otherContainer.children[0].nodeType != NodeType.Br) {
                        otherContainer.children.forEach((element: Element) => {
                            const copiedElement = element.copyElement(currentContainer);

                            if (copiedElement) currentContainer.children.push(copiedElement);
                        });
                    }

                    // Delete the other container
                    otherContainer.parent.deleteChild(otherContainer);
                } else {
                    // Delete the next element
                    nextElement.onDelete(0);
                }
            }



        } else {
            // Remove the next character
            this.text = this.text.substring(0, offset) + this.text.substring(offset + 1);

            // If we have no text
            if (this.text.length == 0) {

                // Delete this text element
                const selectedElement = this.parent.deleteChild(this, {
                    selectedChildOnDeletion: SelectedElementOnDeletion.Next,
                    preserveContainer: true
                });


                const currentContainer = this.container;

                // If we are the last element or this container is not the selected element's container
                if (!selectedElement || currentContainer != selectedElement.container) {

                    // If this container has no children
                    if (currentContainer.children.length == 0) {
                        currentContainer.children.push(new BreakElement(currentContainer));
                        return currentContainer.getStartSelection(offset);
                    }


                } else {
                    return selectedElement.getStartSelection(0);
                }


            }
        }

        return this.getStartSelection(offset);
    }








    // ---------------------------------------------------On Enter-----------------------------------------------------   
    onEnter(offset: number): Selection {
        const container = this.container;
        const containerIndex = container.parent.children.findIndex(x => x == container);
        const lastChild = container.lastChild as TextElement;
        let textElement = this as TextElement;
        const firstRange = new ElementRange();

        firstRange.startElementId = container.children[0].id;
        firstRange.startOffset = 0;
        firstRange.endElementId = textElement.id;
        firstRange.endOffset = offset;

        const firstSegment = container.copyElement(container.parent, { range: firstRange });

        if (offset == this.text.length && this != lastChild) {
            textElement = textElement.nextChild as TextElement;
            offset = 0;
        }

        const secondRange = new ElementRange();
        secondRange.startElementId = textElement.id;
        secondRange.startOffset = offset;
        secondRange.endElementId = lastChild.id;
        secondRange.endOffset = lastChild.text.length;

        const secondSegment = container.copyElement(container.parent, { range: secondRange });

        if (firstSegment) container.parent.children.splice(containerIndex + 1, 0, firstSegment);
        if (secondSegment) container.parent.children.splice(containerIndex + 2, 0, secondSegment);


        // Delete the container
        container.parent.deleteChild(container);

        let selection!: Selection;

        if (secondSegment) selection = secondSegment.firstChild.getStartSelection();

        return selection;
    }








    // ---------------------------------------------------Copy Element-----------------------------------------------------
    copyElement(parent: Element, options?: CopyElementOptions): Element | null {
        let text = this.text;

        if (options && options.range && options.range.startElementId == this.id) {
            options.range.inRange = true;
            text = text.substring(options.range.startOffset, options.range.startElementId == options.range.endElementId ? options.range.endOffset : undefined);
        } else if (options && options.range && options.range.endElementId == this.id) {
            text = text.substring(0, options.range.endOffset);
        }

        if (!options || !options.range || options.range.inRange) {
            if (options && options.range?.endElementId == this.id) {
                options.range.inRange = false;

                if (text.length == 0) {
                    const breakElement = new BreakElement(parent);
                    return breakElement;
                }
            }

            const textElement = new TextElement(parent, text);
            if (!options || !options.createNewChildId) textElement.id = this.id;
            return textElement;
        }

        return null;
    }




    // ---------------------------------------------------On Input-----------------------------------------------------
    onInput(text: string, offset: number): Selection {
        this.text = this.text.substring(0, offset) + text + this.text.substring(offset);
        offset += text.length;

        return this.getStartSelection(offset);
    }








    getStartSelection(startOffset?: number): Selection {
        const selection = new Selection();

        selection.startOffset = startOffset ? startOffset == Infinity ? this.text.length : startOffset : 0;
        selection.startElement = this;
        selection.startChildIndex = this.parent.children.findIndex(x => x == this);

        return selection;
    }


    getStartEndSelection(startOffset?: number, endOffset?: number): Selection {
        const selection = new Selection();

        selection.endElement = selection.startElement = this;
        selection.startOffset = startOffset ? startOffset : 0;
        selection.endOffset = endOffset ? endOffset : this.text.length;
        selection.endChildIndex = selection.startChildIndex = this.parent.children.findIndex(x => x == this);

        return selection;
    }

    getEndSelection(endOffset?: number): Selection {
        const selection = new Selection();

        selection.endOffset = endOffset ? endOffset : this.text.length;
        selection.endElement = this;
        selection.endChildIndex = this.parent.children.findIndex(x => x == this);

        return selection;
    }



    // ---------------------------------------------------Create Element-----------------------------------------------------
    createElement(parent: Element): Element {
        return new TextElement(parent, this.text);
    }
}