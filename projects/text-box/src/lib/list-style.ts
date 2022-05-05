import { DivElement } from "./div-element";
import { Element } from "./element";
import { ElementRange } from "./element-range";
import { ElementType } from "./element-type";
import { ListItemElement } from "./list-item-element";
import { Style } from "./style";

export abstract class ListStyle extends Style {
    public isSelected!: boolean;
    protected listType!: ElementType;

    // ---------------------------------------------------------Set Style------------------------------------------------------------------
    public setStyle(): void {
        let selectedContainers = this.getSelectedContainers();
        const topList = selectedContainers[0].getTopList();


        if (selectedContainers.every(x => x.elementType == ElementType.ListItem && x.getTopList() == topList)) {
            const selectedLists = this.getSelectedLists(selectedContainers);

            // Swap list type
            if (!selectedLists.every(x => x.elementType == this.listType)) {
                selectedLists.forEach((selectedList: Element) => {
                    const currentList = Element.search(selectedList.id, selectedList.root);
                    const newList = this.swapListType(currentList!);

                    newList.parent.children.splice(selectedList.index, 1, newList);
                });
            }

            // Remove from list
            else {
                this.removeFromList(topList, selectedContainers);
            }
        }

        // Add to list
        else {
            this.addToList(selectedContainers);
        }


        this.selection.getSelectedStyles();
        this.setSelectedStyle();
    }




    // ---------------------------------------------------------Get Selected Lists------------------------------------------------------------------
    private getSelectedLists(selectedContainers: Array<Element>): Array<Element> {
        let selectedLists: Array<Element> = [];

        selectedContainers.forEach((container) => {
            container;

            if (!selectedLists.some(x => x == container.parent)) {
                selectedLists.push(container.parent);
            }
        });

        return selectedLists;
    }


    // ---------------------------------------------------------Set Selection From Copy------------------------------------------------------------------
    private setSelectionFromCopy(original: Element, copy: Element) {
        const startElement = Element.search(this.selection.startElement.id, original);
        const endElement = Element.search(this.selection.endElement.id, original);

        if (startElement) {
            this.setSelection(startElement, Element.search(startElement.id, copy)!, true);
        }

        if (endElement && endElement != startElement) {
            this.setSelection(endElement, Element.search(endElement.id, copy)!, true);
        }
    }


    // ---------------------------------------------------------Swap List Type------------------------------------------------------------------
    private swapListType(list: Element, options?: { range?: ElementRange, recursive?: boolean }): Element {
        let newList!: Element;
        let currentList!: Element;
        

        newList = this.createListContainer(list.parent);

        if (options && options.range) {
            currentList = list.copy(list.parent, options.range, 'all');
            options.range = undefined;
        } else {
            currentList = list;
        }

        currentList.children.forEach((child: Element) => {
            let copiedChild!: Element;

            if (child.elementType != ElementType.ListItem && options && options.recursive) {
                child.parent = newList;
                copiedChild = this.swapListType(child, options);
            } else {
                copiedChild = child.copy(newList, undefined, 'all');
            }

            newList.children.push(copiedChild);
            this.setSelectionFromCopy(child, copiedChild);
        });

        return newList;
    }






    // ---------------------------------------------------------Add To List------------------------------------------------------------------
    private addToList(selectedContainers: Array<Element>) {
        for (let i = 0; i < selectedContainers.length; i++) {
            let container = selectedContainers[i];

            if (container.parent.elementType != this.listType) {


                if (container.elementType == ElementType.Div) {
                    this.convertDivToList(container);
                } else {
                    const topList = container.getTopList();
                    const index = topList.index;
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


                    let startListContainer!: Element;
                    if (firstListSelected) {
                        startListContainer = this.swapListType(topList, { range: startRange, recursive: true });
                    } else {
                        startListContainer = topList.copy(topList.parent, startRange);
                    }


                    topList.parent.children.splice(index, 0, startListContainer);


                    if (endRange.startElementId) {
                        let endListContainer!: Element;

                        if (!firstListSelected) {
                            endListContainer = this.swapListType(topList, { range: endRange, recursive: true });
                        } else {
                            endListContainer = topList.copy(topList.parent, endRange);
                        }

                        topList.parent.children.splice(index + 1, 0, endListContainer);
                    }

                    topList.delete();
                }
            }
        }
    }


    // ---------------------------------------------------------Remove From List------------------------------------------------------------------
    private removeFromList(topList: Element, selectedContainers: Array<Element>) {
        // We have to copy the list and split it into different parts so we can remove the selected list items
        const startIndex = topList.index;
        let index = startIndex + 1;

        // If the first selected container is NOT the first container in the list
        if (selectedContainers[0] != topList.firstChild.container) {
            // Set the range of what we are copying
            const startRange = new ElementRange();
            startRange.startElementId = topList.id;
            startRange.endElementId = selectedContainers[0].previousChild?.id as string;

            // Copy the list
            const startListContainer = topList.copy(topList.parent, startRange);
            topList.parent.children.splice(index, 0, startListContainer);
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
                const copiedElement = child.copy(divElement, undefined, 'all');

                divElement.children.push(copiedElement);
                this.setSelectionFromCopy(child, copiedElement);
            });

            topList.parent.children.splice(index, 0, divElement);
            index++;
        });


        // Copy the list items that are NOT selected
        if (selectedContainers[selectedContainers.length - 1].lastChild != topList.lastChild) {
            const endRange = new ElementRange();

            endRange.startElementId = selectedContainers[selectedContainers.length - 1].lastChild.nextChild?.container.id as string;
            endRange.endElementId = topList.lastChild.id;

            const endListContainer = topList.copy(topList.parent, endRange);
            topList.parent.children.splice(index, 0, endListContainer);
        }

        // Delete the orginal list
        topList.parent.children.splice(startIndex, 1);
    }



    // ---------------------------------------------------------Convert Div To List------------------------------------------------------------------
    private convertDivToList(container: Element) {
        let list!: Element;
        let listParent: Element = container.parent;
        let index = container.index;

        for (let i = -1; i < container.indent; i++) {
            list = this.createListContainer(listParent);
            listParent.children.splice(index, 0, list);
            listParent = list;
            index = 0;
        }


        const listItemElement = new ListItemElement(list);

        // Add the container's children to the new list item element
        container.children.forEach((child: Element) => {
            const copiedElement = child.copy(listItemElement, undefined, 'all');

            listItemElement.children.push(copiedElement);
            this.setSelectionFromCopy(child, copiedElement);
        });

        // Add the list item element to the list along with any styles
        list.children.push(listItemElement);
        listItemElement.styles = container.styles;

        // Delete the container
        container.delete();
    }








    // ---------------------------------------------------------Get Indent Level-------------------------------------------------------------
    private getIndentLevel(list: Element): number {
        let level = 0;

        if (list.elementType == ElementType.Div) return level;

        while (list.parent.elementType != ElementType.Div && list.parent.elementType != ElementType.Root) {
            list = list.parent;
            level++;
        }

        return level;
    }






    // ---------------------------------------------------------Set Selected Style-------------------------------------------------------------
    public setSelectedStyle(): void {
        const selectedContainers = this.getSelectedContainers();

        this.isSelected = selectedContainers.every(x => x.elementType == ElementType.ListItem && x.parent.elementType == this.listType);
    }



    // ---------------------------------------------------------Create List Container------------------------------------------------------------------
    protected abstract createListContainer(parent: Element): Element;
}