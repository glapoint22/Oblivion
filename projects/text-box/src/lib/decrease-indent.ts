import { Element } from "./element";
import { ElementRange } from "./element-range";
import { ElementType } from "./element-type";
import { Selection } from "./selection";
import { Style } from "./style";

export class DecreaseIndent extends Style {
    constructor(selection: Selection) {
        super(selection);
    }


    // ---------------------------------------------------------Set Style-------------------------------------------------------------
    public setStyle(): void {
        const selectedContainers = this.getSelectedContainers();

        // Don't decrease the indent if any of the container's indent is at zero
        if (!selectedContainers.some(x => (x.elementType == ElementType.ListItem && x.parent.parent.elementType == ElementType.Root) ||
            (x.elementType == ElementType.Div && x.indent == 0))) {

            for (let i = 0; i < selectedContainers.length; i++) {
                let container = selectedContainers[i];

                // If the container is a div element
                if (container.elementType == ElementType.Div) {
                    container.setIndent(-1);
                } else {
                    const topList = container.getTopList();
                    const lastContainerOfListIndex = selectedContainers.findIndex(x => x == topList.children[topList.children.length - 1].lastChild.container);

                    // First half or the whole list is selected
                    if (container == topList.children[0].firstChild.container) {

                        // The whole list is selected
                        if (lastContainerOfListIndex != -1) {
                            let index = 0;
                            const firstChild = topList.children[0];

                            // Move each child from the first child and insert them into the top list
                            firstChild.children.forEach((child: Element) => {
                                const copy = child.copy(topList, { preserveSelection: this.selection });

                                topList.children.splice(index, 0, copy);
                                index++;

                            });

                            // Reset the selection
                            this.selection.resetSelection(firstChild, topList, true);

                            // Delete the orginal first child
                            firstChild.delete();

                            i = lastContainerOfListIndex;
                        }


                        // The first half of the list is selected
                        else {
                            const startRange = new ElementRange();
                            const endRange = new ElementRange();
                            const topListIndex = topList.index;

                            startRange.startElementId = topList.children[0].id;
                            startRange.endElementId = selectedContainers[selectedContainers.length - 1].lastChild.id;
                            endRange.startElementId = selectedContainers[selectedContainers.length - 1].lastChild.nextChild?.container.id as string;
                            endRange.endElementId = topList.lastChild.id;


                            const startListContainer = topList.copy(topList.parent, { range: startRange, preserveSelection: this.selection });
                            const firstChild = startListContainer.children[0];
                            let index = 0;

                            topList.parent.children.splice(topListIndex, 0, startListContainer);

                            // Move each child from the first child and insert them into the top list
                            firstChild.children.forEach((child: Element) => {
                                const copy = child.copy(startListContainer, { preserveSelection: this.selection });

                                if (copy) {
                                    startListContainer.children.splice(index, 0, copy);
                                    index++;
                                }
                            });

                            this.selection.resetSelection(firstChild, startListContainer, true);


                            // Delete the orginal first child
                            firstChild.delete();


                            const endListContainer = topList.copy(topList.parent, { range: endRange });
                            if (endListContainer) topList.parent.children.splice(topListIndex + 1, 0, endListContainer);


                            topList.delete();
                            i = selectedContainers.length - 1;
                        }
                    }

                    // The second half or the middle of list is selected
                    else {


                        // The second half of the list is selected
                        if (lastContainerOfListIndex != -1) {
                            const startRange = new ElementRange();
                            const endRange = new ElementRange();
                            const topListIndex = topList.index;

                            startRange.startElementId = topList.children[0].id;
                            startRange.endElementId = container.previousChild?.id as string;
                            endRange.startElementId = container.id;
                            endRange.endElementId = topList.lastChild.id;


                            const startListContainer = topList.copy(topList.parent, { range: startRange });
                            if (startListContainer) {
                                topList.parent.children.splice(topListIndex, 0, startListContainer);
                            }



                            const endListContainer = topList.copy(topList.parent, { range: endRange });
                            if (endListContainer) {
                                topList.parent.children.splice(topListIndex + 1, 0, endListContainer);

                                const firstChild = endListContainer.children[0];

                                // Copy each child of the first child to the top list
                                firstChild.children.forEach((child: Element) => {
                                    const copy = child.copy(endListContainer);

                                    if (copy) {
                                        endListContainer.children.push(copy);
                                    }
                                });

                                // Delete the orginal first child
                                firstChild.delete();
                            }



                            topList.delete();


                            i = lastContainerOfListIndex;
                        }


                        // The middle of the list is selected
                        else {
                            const startRange = new ElementRange();
                            const middleRange = new ElementRange();
                            const endRange = new ElementRange();
                            const topListIndex = topList.index;

                            // Start Range
                            startRange.startElementId = topList.children[0].id;
                            startRange.endElementId = container.previousChild?.id as string;

                            // Middle Range
                            middleRange.startElementId = container.id;
                            middleRange.endElementId = selectedContainers[selectedContainers.length - 1].lastChild.id;

                            // End Range
                            endRange.startElementId = selectedContainers[selectedContainers.length - 1].lastChild.nextChild?.container.id as string;
                            endRange.endElementId = topList.lastChild.id;



                            // start
                            const startListContainer = topList.copy(topList.parent, { range: startRange });
                            if (startListContainer) {
                                topList.parent.children.splice(topListIndex, 0, startListContainer);
                            }



                            // Middle
                            const middleListContainer = topList.copy(topList.parent, { range: middleRange });
                            if (middleListContainer) {
                                topList.parent.children.splice(topListIndex + 1, 0, middleListContainer);

                                const firstChild = middleListContainer.children[0];

                                // Copy each child of the first child to the top list
                                firstChild.children.forEach((child: Element) => {
                                    const copy = child.copy(middleListContainer);

                                    if (copy) {
                                        middleListContainer.children.push(copy);
                                    }
                                });

                                // Delete the orginal first child
                                firstChild.delete();
                            }




                            // End
                            const endListContainer = topList.copy(topList.parent, { range: endRange });
                            if (endListContainer) topList.parent.children.splice(topListIndex + 2, 0, endListContainer);


                            topList.delete();
                            i = selectedContainers.length - 1;
                        }
                    }
                }
            }
        }
    }




    // ---------------------------------------------------------Set Selected Style-------------------------------------------------------------
    public setSelectedStyle(): void {
        throw new Error("Method not implemented.");
    }
}