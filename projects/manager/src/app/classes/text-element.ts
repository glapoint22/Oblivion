import { NodeType, Style } from "widgets";
import { BreakElement } from "./break-element";
import { ElementRange } from "./element-range";
import { Element } from "./element";
import { SelectedElementOnDeletion } from "./enums";
import { SelectedElement } from "./selected-element";
import { SpanElement } from "./span-element";

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
    onBackspace(offset: number): SelectedElement {
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
                    const selectedElement = previousContainer.deleteChild(previousContainerLastChild, { selectedChildOnDeletion: SelectedElementOnDeletion.Next });

                    if (selectedElement) return selectedElement.setSelectedElement(0);

                } else {
                    return previousContainerLastChild.setSelectedElement(Infinity);
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
                        return container.setSelectedElement(offset);
                    } else {

                        // we have children remaining...Set the cursor on the next sibling
                        if (selectedElement) return selectedElement.setSelectedElement(0);
                    }
                }

                // We are NOT at the start of the container
            } else {
                // If we have no text left...Delete this text element and place cursor at previous sibling
                if (this.text.length == 0) {
                    const previousChild = this.parent.deleteChild(this, { selectedChildOnDeletion: SelectedElementOnDeletion.Previous });

                    if (previousChild) return previousChild.setSelectedElement(Infinity);
                } else {
                    // place cursor at previous child
                    const previousChild = this.previousChild;

                    if (previousChild) {
                        return previousChild.setSelectedElement(Infinity);
                    }
                }
            }
        }

        return this.setSelectedElement(offset);
    }




    // --------------------------------------------------On Delete-----------------------------------------------------
    onDelete(offset: number): SelectedElement {

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
                        return currentContainer.setSelectedElement(offset);
                    }


                } else {
                    return selectedElement.setSelectedElement(0);
                }


            }
        }

        return this.setSelectedElement(offset);
    }








    // ---------------------------------------------------On Enter-----------------------------------------------------   
    onEnter(offset: number): SelectedElement {
        const container = this.container;
        const containerIndex = container.parent.children.findIndex(x => x == container);
        const topParent = this.topParent;
        const lastChild = container.lastChild as TextElement;
        const leftFragment = container.copyElement(container.parent, new ElementRange(container.id, container.children[0].id, 0, this.id, offset, topParent.id));
        const rightFragment = container.copyElement(container.parent, new ElementRange(container.id, this.id, offset, lastChild.id, lastChild.text.length, topParent.id));

        if (leftFragment) container.parent.children.splice(containerIndex + 1, 0, leftFragment);
        if (rightFragment) container.parent.children.splice(containerIndex + 2, 0, rightFragment);


        // Delete the container
        container.parent.deleteChild(container);

        let selectedElement!: SelectedElement;

        if (rightFragment) selectedElement = rightFragment.firstChild.setSelectedElement(0);

        return selectedElement;
    }








    // ---------------------------------------------------Copy Element-----------------------------------------------------
    copyElement(parent: Element, range?: ElementRange): Element | null {
        let text = this.text;

        if (range && range.startElementId == this.id) {
            range.inRange = true;
            text = text.substring(range.startOffset, range.startElementId == range.endElementId ? range.endOffset : undefined);
        } else if (range && range.endElementId == this.id) {
            text = text.substring(0, range.endOffset);
        } else if (range && range.topParentId == this.id) {
            range.inTopParentRange = true;
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
            textElement.id = this.id;
            return textElement;
        }

        return null;
    }




    // ---------------------------------------------------On Keydown-----------------------------------------------------
    onKeydown(key: string, offset: number): SelectedElement {
        this.text = this.text.substring(0, offset) + key + this.text.substring(offset);
        offset++;

        return this.setSelectedElement(offset);
    }







    // ---------------------------------------------------Set Selected Element-----------------------------------------------------
    setSelectedElement(offset: number): SelectedElement {
        const index = this.parent.children.findIndex(x => x == this);

        if (offset == Infinity) offset = this.text.length;
        return new SelectedElement(this.parent.id, offset, index);
    }






    // ---------------------------------------------------Create Element-----------------------------------------------------
    createElement(parent: Element): Element {
        return new TextElement(parent, this.text);
    }






    styleBeginningText(style: Style, endOffset: number) {
        const startText = this.text.substring(0, endOffset);
        const endText = this.text.substring(endOffset);
        const parent = this.parent;
        const index = parent.children.findIndex(x => x == this);
        const spanElement = new SpanElement(parent);

        this.text = startText;
        spanElement.styles.push(style);
        spanElement.children.push(this.copyElement(spanElement) as TextElement);
        parent.children.splice(index, 1, spanElement);
        parent.children.splice(index + 1, 0, new TextElement(parent, endText));
    }




    styleMiddleText(style: Style, startOffset: number, endOffset: number) {
        const middleText = this.text.substring(startOffset, endOffset);
        const endText = this.text.substring(endOffset);
        const parent = this.parent;
        const spanElement = new SpanElement(parent);
        const index = parent.children.findIndex(x => x == this);

        this.text = this.text.substring(0, startOffset);
        spanElement.styles.push(style);
        spanElement.children.push(new TextElement(spanElement, middleText));
        parent.children.splice(index + 1, 0, spanElement);
        parent.children.splice(index + 2, 0, new TextElement(parent, endText));
    }




    styleEndText(style: Style, startOffset: number) {
        const endText = this.text.substring(startOffset);
        const parent = this.parent;
        const spanElement = new SpanElement(parent);
        const index = parent.children.findIndex(x => x == this);

        this.text = this.text.substring(0, startOffset);
        spanElement.styles.push(style);
        spanElement.children.push(new TextElement(spanElement, endText));
        parent.children.splice(index + 1, 0, spanElement);
    }



    styleWholeText(style: Style) {
        if (this.parent.nodeType == NodeType.Span) {
            this.parent.styles.push(style);
        } else {
            const parent = this.parent;
            const index = parent.children.findIndex(x => x == this);
            const spanElement = new SpanElement(parent);

            spanElement.styles.push(style);
            spanElement.children.push(this.copyElement(spanElement) as TextElement);
            parent.children.splice(index, 1, spanElement);
        }
    }
}