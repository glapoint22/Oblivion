import { NodeType } from "widgets";
import { BreakElement } from "./break-element";
import { ElementRange } from "./element-range";
import { Element } from "./element";
import { SelectedElementOnDeletion } from "./enums";
import { Selection } from "./selection";

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


        const leftFragment = container.copyElement(container.parent, new ElementRange(container.id, container.children[0].id, 0, textElement.id, offset, textElement.topParent.id));

        if (offset == this.text.length && this != lastChild) {
            textElement = textElement.nextChild as TextElement;
            offset = 0;
        }

        const rightFragment = container.copyElement(container.parent, new ElementRange(container.id, textElement.id, offset, lastChild.id, lastChild.text.length, textElement.topParent.id));

        if (leftFragment) container.parent.children.splice(containerIndex + 1, 0, leftFragment);
        if (rightFragment) container.parent.children.splice(containerIndex + 2, 0, rightFragment);


        // Delete the container
        container.parent.deleteChild(container);

        let selection!: Selection;

        if (rightFragment) selection = rightFragment.firstChild.getStartSelection();

        return selection;
    }








    // ---------------------------------------------------Copy Element-----------------------------------------------------
    copyElement(parent: Element, range?: ElementRange, copyChildId = true): Element | null {
        let text = this.text;

        if (range && range.startElementId == this.id) {
            range.inRange = true;
            text = text.substring(range.startOffset, range.startElementId == range.endElementId ? range.endOffset : undefined);
        } else if (range && range.endElementId == this.id) {
            text = text.substring(0, range.endOffset);
        }

        if (!range || range.inRange) {
            if (range?.endElementId == this.id) {
                range.inRange = false;
                range.inTopParentRange = false;

                if (text.length == 0) {
                    const breakElement = new BreakElement(parent);
                    return breakElement;
                }
            }

            const textElement = new TextElement(parent, text);
            if (copyChildId) textElement.id = this.id;
            return textElement;
        }

        return null;
    }




    // ---------------------------------------------------On Keydown-----------------------------------------------------
    onKeydown(key: string, offset: number): Selection {
        this.text = this.text.substring(0, offset) + key + this.text.substring(offset);
        offset++;

        return this.getStartSelection(offset);
    }








    getStartSelection(startOffset?: number): Selection {
        const selection = new Selection();

        selection.startOffset = startOffset ? startOffset == Infinity ? this.text.length : startOffset : 0;
        selection.startElement = this;
        selection.startChildIndex = this.parent.children.findIndex(x => x == this);

        return selection;
    }


    getStartEndSelection(): Selection {
        const selection = new Selection();

        selection.endElement = selection.startElement = this;
        selection.startOffset = 0;
        selection.endOffset = this.text.length;
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