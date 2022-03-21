import { NodeType } from "widgets";
import { BreakElement } from "./break-element";
import { ElementRange } from "./element-range";
import { Element } from "./element";
import { SelectedElementOnDeletion } from "./enums";
import { SelectedElement } from "./selected-element";

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
            const previousElement = this.getPreviousChild();

            if (!previousElement.isRoot) {
                const currentContainer = this.getContainer();
                const previousContainer = previousElement.getLastChild().getContainer();
                const previousContainerLastChild = previousContainer.getLastChild();

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
                    return selectedElement.setSelectedElement(0);
                } else {
                    return previousContainerLastChild.setSelectedElement(Infinity);
                }
            } else {
                offset = 0;
            }





            // Cursor is at start of the text
        } else if (offset == 0) {
            const container = this.getContainer();
            const topParent = this.getTopParent();

            // Test to see if we are at the start of the container
            if (container.children[0] == topParent && topParent.getFirstChild() == this) {

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
                        return selectedElement.setSelectedElement(0);
                    }
                }

                // We are NOT at the start of the container
            } else {
                // If we have no text left...Delete this text element and place cursor at previous sibling
                if (this.text.length == 0) {
                    return this.parent.deleteChild(this, { selectedChildOnDeletion: SelectedElementOnDeletion.Previous }).setSelectedElement(Infinity);
                } else {
                    // place cursor at previous sibling
                    return this.getPreviousChild().getLastChild().setSelectedElement(Infinity);
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
            let nextElement = this.getNextChild();

            if (!nextElement.isRoot) {
                nextElement = nextElement.getFirstChild();

                // Get this container and the other container the next element is in
                const currentContainer = this.getContainer();
                const otherContainer = nextElement.getContainer();

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


                const currentContainer = this.getContainer();

                // If we are the last element or this container is not the selected element's container
                if (selectedElement.isRoot || currentContainer != selectedElement.getContainer()) {

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
        const container = this.getContainer();
        const containerIndex = container.parent.children.findIndex(x => x == container);
        const topParent = this.getTopParent();
        const lastChild = container.getLastChild() as TextElement;
        const leftFragment = container.copyElement(container.parent, new ElementRange(container.id, container.children[0].id, 0, this.id, offset, topParent.id));
        const rightFragment = container.copyElement(container.parent, new ElementRange(container.id, this.id, offset, lastChild.id, lastChild.text.length, topParent.id));

        if (leftFragment) container.parent.children.splice(containerIndex + 1, 0, leftFragment);
        if (rightFragment) container.parent.children.splice(containerIndex + 2, 0, rightFragment);


        // Delete the container
        container.parent.deleteChild(container);

        let selectedElement!: SelectedElement;

        if (rightFragment) selectedElement = rightFragment.getFirstChild().setSelectedElement(0);

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

        return super.onKeydown(key, offset);
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
}