import { NodeType } from "widgets";
import { DivElement } from "./div-element";
import { Element } from "./element";
import { ElementRange } from "./element-range";
import { ListItemElement } from "./list-item-element";
import { Style } from "./style";

export abstract class ListStyle extends Style {
    public isSelected!: boolean;
    protected listType!: NodeType;

    // ---------------------------------------------------------Set Style------------------------------------------------------------------
    public setStyle(): void {
        let selectedContainers = this.getSelectedContainers();
        const topContainer = this.getTopList(selectedContainers[0]);


        if (selectedContainers.every(x => x.nodeType == NodeType.Li && this.getTopList(x) == topContainer)) {
            let selectedLists: Array<Element> = [];

            selectedContainers.forEach((container) => {
                container;

                if (!selectedLists.some(x => x == container.parent)) {
                    selectedLists.push(container.parent);
                }
            });


            // Swaping list types
            if (!selectedLists.every(x => x.nodeType == this.listType)) {

                selectedLists.forEach((currentList: Element) => {
                    const list = Element.search(currentList.id, this.text.root);

                    if (list) {
                        const index = list.parent.children.findIndex(x => x.id == list.id);
                        const newList = this.createListContainer(list.parent);

                        list.children.forEach((child: Element) => {
                            const copiedChild = child.copyElement(newList, { preserveId: true });

                            if (copiedChild) {
                                newList.children.push(copiedChild);
                            }
                        });

                        list.parent.children.splice(index, 1, newList);
                    }
                });


                // Removing from the list
            } else {


                // We have to copy the list and split it into different parts so we can remove the selected list items
                const startIndex = topContainer.parent.children.findIndex(x => x == topContainer);
                let index = startIndex + 1;

                // If the first selected container is NOT the first container in the list
                if (selectedContainers[0] != topContainer.firstChild.container) {
                    // Set the range of what we are copying
                    const startRange = new ElementRange();
                    startRange.startElementId = topContainer.id;
                    startRange.endElementId = selectedContainers[0].previousChild?.id as string;

                    // Copy the list
                    const startListContainer = topContainer.copyElement(topContainer.parent, { range: startRange });
                    if (startListContainer) topContainer.parent.children.splice(index, 0, startListContainer);
                    index++;
                }

                // Transform the selected list items into divs
                selectedContainers.forEach((container: Element) => {
                    const divElement = new DivElement(topContainer.parent);
                    divElement.styles = container.styles;

                    const level = this.getLevel(container.parent);

                    if (level > 0) divElement.indent = level;

                    // Add the container's children to the new div element
                    container.children.forEach((child: Element) => {
                        const copiedElement = child.copyElement(divElement);

                        if (copiedElement) {
                            divElement.children.push(copiedElement);
                        }
                    });

                    topContainer.parent.children.splice(index, 0, divElement);
                    index++;
                });


                // Copy the list items that are NOT selected
                if (selectedContainers[selectedContainers.length - 1].lastChild != topContainer.lastChild) {
                    const endRange = new ElementRange();

                    endRange.startElementId = selectedContainers[selectedContainers.length - 1].lastChild.nextChild?.container.id as string;
                    endRange.endElementId = topContainer.lastChild.id;

                    const endListContainer = topContainer.copyElement(topContainer.parent, { range: endRange });
                    if (endListContainer) topContainer.parent.children.splice(index, 0, endListContainer);
                }

                // Delete the orginal list
                topContainer.parent.children.splice(startIndex, 1);
            }






            // Adding to the list
        } else {

            for (let i = 0; i < selectedContainers.length; i++) {
                let container = selectedContainers[i];

                if (container.parent.nodeType != this.listType) {


                    if (container.nodeType == NodeType.Div) {
                        this.convertDivToList(container);
                    } else {
                        const topList = this.getTopList(container);
                        const index = topList.parent.children.findIndex(x => x == topList);
                        const lastContainer = selectedContainers.find((x, index) => x == topList.lastChild.container || index == selectedContainers.length - 1);
                        const startRange = new ElementRange();
                        const endRange = new ElementRange();
                        let firstListSelected!: boolean;

                        if (topList.children[0] == container) {
                            firstListSelected = true;
                            startRange.startElementId = topList.children[0].id;

                            // The whole list is selected
                            if (lastContainer == topList.lastChild.container) {
                                startRange.endElementId = topList.lastChild.id;

                                i = selectedContainers.findIndex(x => x == topList.lastChild.container);
                            }

                            // First half of the list is selected
                            else {
                                startRange.endElementId = selectedContainers[selectedContainers.length - 1].lastChild.id;
                                endRange.startElementId = selectedContainers[selectedContainers.length - 1].lastChild.nextChild?.container.id as string;
                                endRange.endElementId = topList.lastChild.id;


                                i = selectedContainers.length;
                            }
                        }

                        // Second half of the list is selected
                        else {
                            startRange.startElementId = topList.children[0].id;
                            startRange.endElementId = selectedContainers[0].previousChild?.id as string;
                            endRange.startElementId = selectedContainers[0].id;
                            endRange.endElementId = topList.lastChild.id;

                            i = selectedContainers.findIndex(x => x == topList.lastChild.container);
                        }


                        const startListContainer = topList.copyElement(topList.parent, { range: startRange, changeType: firstListSelected ? this.listType : undefined });
                        if (startListContainer) topList.parent.children.splice(index, 0, startListContainer);


                        if (endRange.startElementId) {
                            const endListContainer = topList.copyElement(topList.parent, { range: endRange, changeType: !firstListSelected ? this.listType : undefined });
                            if (endListContainer) topList.parent.children.splice(index + 1, 0, endListContainer);
                        }


                        topList.parent.deleteChild(topList);
                    }
                }
            }
        }



        this.text.selection.resetSelection(topContainer.parent, this.text.selection.startOffset, this.text.selection.endOffset);
        this.text.merge();
        this.text.render();
        this.finalizeStyle();
    }








    // ---------------------------------------------------------Convert Div To List------------------------------------------------------------------
    private convertDivToList(container: Element) {
        let list!: Element;
        let listParent: Element = container.parent;
        let index = container.parent.children.findIndex(x => x == container);

        for (let i = -1; i < container.indent; i++) {
            list = this.createListContainer(listParent);
            listParent.children.splice(index, 0, list);
            listParent = list;
            index = 0;
        }


        const listItemElement = new ListItemElement(list);

        // Add the container's children to the new list item element
        container.children.forEach((child: Element) => {
            const copiedElement = child.copyElement(listItemElement);

            if (copiedElement) {
                listItemElement.children.push(copiedElement);
            }
        });

        // Add the list item element to the list along with any styles
        list.children.push(listItemElement);
        listItemElement.styles = container.styles;

        // Delete the container
        container.parent.deleteChild(container);
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





    // ---------------------------------------------------------Get Level-------------------------------------------------------------
    private getLevel(listContainer: Element): number {
        let level = 0;

        if (listContainer.nodeType == NodeType.Div) return level;

        while (listContainer.parent.nodeType != NodeType.Div) {
            listContainer = listContainer.parent;
            level++;
        }

        return level;
    }








    // ---------------------------------------------------------Get Top Container-------------------------------------------------------------
    private getTopList(element: Element): Element {
        let container = element.container;

        while (container.parent.nodeType != NodeType.Div) {
            container = container.parent;
        }

        return container;
    }












    // ---------------------------------------------------------Set Selected Style-------------------------------------------------------------
    public setSelectedStyle(): void {
        const selectedContainers = this.getSelectedContainers();

        this.isSelected = selectedContainers.every(x => x.nodeType == NodeType.Li && x.parent.nodeType == this.listType);
    }



    // ---------------------------------------------------------Create List Container------------------------------------------------------------------
    protected abstract createListContainer(parent: Element): Element;
}