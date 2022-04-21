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
        const topList = selectedContainers[0].getTopList();


        if (selectedContainers.every(x => x.nodeType == NodeType.Li && x.getTopList() == topList)) {
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
                const startIndex = topList.parent.children.findIndex(x => x == topList);
                let index = startIndex + 1;

                // If the first selected container is NOT the first container in the list
                if (selectedContainers[0] != topList.firstChild.container) {
                    // Set the range of what we are copying
                    const startRange = new ElementRange();
                    startRange.startElementId = topList.id;
                    startRange.endElementId = selectedContainers[0].previousChild?.id as string;

                    // Copy the list
                    const startListContainer = topList.copyElement(topList.parent, { range: startRange });
                    if (startListContainer) topList.parent.children.splice(index, 0, startListContainer);
                    index++;
                }

                // Transform the selected list items into divs
                selectedContainers.forEach((container: Element) => {
                    const divElement = new DivElement(topList.parent);
                    divElement.styles = container.styles;

                    const level = this.getIndentLevel(container.parent);

                    if (level > 0) divElement.indent = level;

                    // Add the container's children to the new div element
                    container.children.forEach((child: Element) => {
                        const copiedElement = child.copyElement(divElement);

                        if (copiedElement) {
                            divElement.children.push(copiedElement);
                        }
                    });

                    topList.parent.children.splice(index, 0, divElement);
                    index++;
                });


                // Copy the list items that are NOT selected
                if (selectedContainers[selectedContainers.length - 1].lastChild != topList.lastChild) {
                    const endRange = new ElementRange();

                    endRange.startElementId = selectedContainers[selectedContainers.length - 1].lastChild.nextChild?.container.id as string;
                    endRange.endElementId = topList.lastChild.id;

                    const endListContainer = topList.copyElement(topList.parent, { range: endRange });
                    if (endListContainer) topList.parent.children.splice(index, 0, endListContainer);
                }

                // Delete the orginal list
                topList.parent.children.splice(startIndex, 1);
            }






            // Adding to the list
        } else {

            for (let i = 0; i < selectedContainers.length; i++) {
                let container = selectedContainers[i];

                if (container.parent.nodeType != this.listType) {


                    if (container.nodeType == NodeType.Div) {
                        this.convertDivToList(container);
                    } else {
                        const topList = container.getTopList();
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



        this.text.selection.resetSelection(this.text.root, this.text.selection.startOffset, this.text.selection.endOffset);
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


    





    // ---------------------------------------------------------Get Indent Level-------------------------------------------------------------
    private getIndentLevel(list: Element): number {
        let level = 0;

        if (list.nodeType == NodeType.Div) return level;

        while (list.parent.nodeType != NodeType.Div) {
            list = list.parent;
            level++;
        }

        return level;
    }






    // ---------------------------------------------------------Set Selected Style-------------------------------------------------------------
    public setSelectedStyle(): void {
        const selectedContainers = this.getSelectedContainers();

        this.isSelected = selectedContainers.every(x => x.nodeType == NodeType.Li && x.parent.nodeType == this.listType);
    }



    // ---------------------------------------------------------Create List Container------------------------------------------------------------------
    protected abstract createListContainer(parent: Element): Element;
}