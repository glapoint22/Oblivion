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


                            const startList = topList.copy(topList.parent, { range: startRange, preserveSelection: this.selection });
                            const firstChild = startList.children[0];
                            let index = 0;

                            topList.parent.children.splice(topListIndex, 0, startList);

                            // Move each child from the first child and insert them into the top list
                            firstChild.children.forEach((child: Element) => {
                                const copy = child.copy(startList, { preserveSelection: this.selection });

                                startList.children.splice(index, 0, copy);
                                index++;
                            });

                            // Reset the selection
                            this.selection.resetSelection(firstChild, startList, true);


                            // Delete the orginal first child
                            firstChild.delete();


                            const endList = topList.copy(topList.parent, { range: endRange });
                            topList.parent.children.splice(topListIndex + 1, 0, endList);


                            topList.delete();
                            i = selectedContainers.length - 1;
                        }
                    }

                    // The second half or the middle of list is selected
                    else {


                        // The second half of the list is selected
                        if (lastContainerOfListIndex != -1) {
                            const firstRange = new ElementRange();
                            const secondRange = new ElementRange();
                            const topListIndex = topList.index;

                            // Set the ranges
                            firstRange.startElementId = topList.children[0].id;
                            firstRange.endElementId = container.previousChild?.id as string;
                            secondRange.startElementId = container.id;
                            secondRange.endElementId = topList.lastChild.id;

                            // Copy and insert the first list
                            const firstList = topList.copy(topList.parent, { range: firstRange });
                            topList.parent.children.splice(topListIndex, 0, firstList);


                            // Copy and insert the second list
                            const secondList = topList.copy(topList.parent, { range: secondRange, preserveSelection: this.selection });
                            topList.parent.children.splice(topListIndex + 1, 0, secondList);

                            // Get the first child from the second list
                            const firstChild = secondList.children[0];

                            // Copy each child of the first child to the top list
                            firstChild.children.forEach((child: Element) => {
                                const copy = child.copy(secondList, { preserveSelection: this.selection });

                                secondList.children.push(copy);
                            });

                            // Reset the selection
                            this.selection.resetSelection(firstChild, secondList, true);


                            firstChild.delete();
                            topList.delete();


                            i = lastContainerOfListIndex;
                        }


                        // The middle of the list is selected
                        else {
                            const firstRange = new ElementRange();
                            const secondRange = new ElementRange();
                            const thirdRange = new ElementRange();
                            const topListIndex = topList.index;

                            // First Range
                            firstRange.startElementId = topList.children[0].id;
                            firstRange.endElementId = container.previousChild?.id as string;

                            // Second Range
                            secondRange.startElementId = container.id;
                            secondRange.endElementId = selectedContainers[selectedContainers.length - 1].lastChild.id;

                            // Third Range
                            thirdRange.startElementId = selectedContainers[selectedContainers.length - 1].lastChild.nextChild?.container.id as string;
                            thirdRange.endElementId = topList.lastChild.id;



                            // First List
                            const firstList = topList.copy(topList.parent, { range: firstRange });
                            topList.parent.children.splice(topListIndex, 0, firstList);



                            // Second List
                            const secondList = topList.copy(topList.parent, { range: secondRange, preserveSelection: this.selection });
                            topList.parent.children.splice(topListIndex + 1, 0, secondList);

                            const firstChild = secondList.children[0];

                            // Copy each child of the first child to the top list
                            firstChild.children.forEach((child: Element) => {
                                const copy = child.copy(secondList, { preserveSelection: this.selection });

                                secondList.children.push(copy);
                            });

                            // Reset the selection
                            this.selection.resetSelection(firstChild, secondList, true);

                            // Delete the orginal first child
                            firstChild.delete();




                            // Third List
                            const thirdList = topList.copy(topList.parent, { range: thirdRange });
                            topList.parent.children.splice(topListIndex + 2, 0, thirdList);


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