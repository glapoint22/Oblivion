import { NodeType } from "widgets";
import { Element } from "./element";
import { ListItemElement } from "./list-item-element";
import { Style } from "./style";
import { Text } from "./text";
import { UnorderedListElement } from "./unordered-list-element";

export class BulletedList extends Style {

    constructor(text: Text) {
        super(text);
        this.name = 'ul';
    }


    // ---------------------------------------------------------Set Style------------------------------------------------------------------
    public setStyle(): void {
        const selectedContainers = this.getSelectedContainers();

        if (selectedContainers.every(x => x.nodeType == NodeType.Li)) {
            // Remove from list
            const container = selectedContainers[0];
            const topContainer = this.getTopContainer(container);
            const index = topContainer.parent.children.findIndex(x => x == topContainer);

            let a = 0;

        } else {
            selectedContainers.forEach((container: Element, index: number) => {
                if (container.nodeType == NodeType.Div) {
                    const previousListContainer = index == 0 || selectedContainers[index - 1].nodeType == NodeType.Div ? this.getPreviousListContainer(container) : null;
                    const nextListContainer = this.getNextListContainer(container);
                    let listContainer!: Element;
                    let startIndex!: number;

                    if (previousListContainer) {
                        listContainer = previousListContainer;
                        startIndex = listContainer.children.length;
                    } else if (nextListContainer) {
                        listContainer = nextListContainer;
                        startIndex = 0;
                    } else {
                        listContainer = this.createListContainer(container);
                        startIndex = 0;
                    }

                    this.addToListContainer(listContainer, container, startIndex);
                }
            });
        }


        this.text.render();
        this.resetSelection();
    }






    // ---------------------------------------------------------Create List Container------------------------------------------------------------------
    private createListContainer(container: Element): Element {
        const containerIndex = container.parent.children.findIndex(x => x == container);
        const listContainer = new UnorderedListElement(container.parent);

        container.parent.children.splice(containerIndex, 0, listContainer);
        return listContainer;
    }






    // ---------------------------------------------------------Add To List Container------------------------------------------------------------------
    private addToListContainer(listContainer: Element, container: Element, index: number) {
        const listItemElement = new ListItemElement(listContainer);


        // Add the container's children to the new list item element
        container.children.forEach((child: Element) => {
            const copiedElement = child.copyElement(listItemElement);

            if (copiedElement) {
                listItemElement.children.push(copiedElement);
            }
        });

        // Add the list item element to the list along with any styles
        listContainer.children.splice(index, 0, listItemElement);
        listItemElement.styles = container.styles;

        // Delete the container
        container.parent.deleteChild(container);

        // Reset the selection
        this.text.selection.resetSelection(listItemElement, this.text.selection.startOffset, this.text.selection.endOffset);
    }









    // ---------------------------------------------------------Get Selected Containers------------------------------------------------------------------
    private getSelectedContainers(): Array<Element> {
        let currentElement = this.text.selection.startElement;
        let selectedContainers: Array<Element> = new Array<Element>();

        while (true) {
            const container = currentElement.container;
            if (!selectedContainers.some(x => x == container)) selectedContainers.push(container);

            if (currentElement == this.text.selection.endElement || container == this.text.selection.endElement) {
                break;
            }

            const nextChild = currentElement.nextChild;

            if (nextChild) {
                currentElement = nextChild;
            }
        }

        return selectedContainers;
    }









    // ---------------------------------------------------------Get Previous List Container-------------------------------------------------------------
    private getPreviousListContainer(container: Element): Element | null {
        const previousChild = container.previousChild;

        if (previousChild) {
            const previousChildContainer = previousChild.container;

            if (previousChildContainer.nodeType == NodeType.Li && previousChildContainer.parent.nodeType == NodeType.Ul) {
                return previousChildContainer.parent;
            }
        }

        return null;
    }








    // ---------------------------------------------------------Get Next List Container-------------------------------------------------------------
    private getNextListContainer(container: Element): Element | null {
        const nextChild = container.nextChild;

        if (nextChild) {
            const nextChildContainer = nextChild.container;

            if (nextChildContainer.nodeType == NodeType.Li && nextChildContainer.parent.nodeType == NodeType.Ul) {
                return nextChildContainer.parent;
            }
        }

        return null;
    }




    // ---------------------------------------------------------Get Top Container-------------------------------------------------------------
    private getTopContainer(element: Element): Element {
        let container = element.container;

        while (container.parent.nodeType != NodeType.Div) {
            container = container.parent;
        }

        return container;
    }




    public setSelectedStyle(): void {
        // throw new Error("Method not implemented.");
    }
}