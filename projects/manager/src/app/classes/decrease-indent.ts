import { NodeType } from "widgets";
import { DivElement } from "./div-element";
import { Element } from "./element";
import { ElementRange } from "./element-range";
import { Indent } from "./indent";
import { Text } from "./text";

export class DecreaseIndent extends Indent {
    constructor(text: Text) {
        super(text);

        this.indentValue = -1;
    }


    public setStyle(): void {
        const selectedContainers = this.getSelectedContainers();

        if (!selectedContainers.some(x => (x.nodeType == NodeType.Li && x.parent.parent.isRoot) || (x.nodeType == NodeType.Div && x.indent == 0))) {
            if (selectedContainers.every(x => x.nodeType == NodeType.Div)) {
                super.setStyle();
                return;
            }

            for (let i = 0; i < selectedContainers.length; i++) {
                let container = selectedContainers[i];

                if (container.nodeType == NodeType.Div) {
                    const divElement = container as DivElement;
                    divElement.setIndent(this.indentValue);
                } else {
                    const topList = container.getTopList();
                    const lastContainerOfListIndex = selectedContainers.findIndex(x => x == topList.children[topList.children.length - 1].lastChild.container);

                    if (container == topList.children[0].firstChild.container) {


                        // Whole list is selected
                        if (lastContainerOfListIndex != -1) {
                            let index = 0;
                            const firstChild = topList.children[0];

                            // Copy each child of the first child to the top list
                            firstChild.children.forEach((child: Element) => {
                                const copy = child.copyElement(topList);

                                if (copy) {
                                    topList.children.splice(index, 0, copy);
                                    index++;
                                }
                            });

                            // Delete the orginal first child
                            topList.deleteChild(firstChild);

                            i = lastContainerOfListIndex;
                        }

                        // First half of list is selected
                        else {
                            const startRange = new ElementRange();
                            const endRange = new ElementRange();
                            const topListIndex = topList.parent.children.findIndex(x => x == topList);

                            startRange.startElementId = topList.children[0].id;
                            startRange.endElementId = selectedContainers[selectedContainers.length - 1].lastChild.id;
                            endRange.startElementId = selectedContainers[selectedContainers.length - 1].lastChild.nextChild?.container.id as string;
                            endRange.endElementId = topList.lastChild.id;


                            const startListContainer = topList.copyElement(topList.parent, { range: startRange });
                            if (startListContainer) {
                                topList.parent.children.splice(topListIndex, 0, startListContainer);

                                let index = 0;
                                const firstChild = startListContainer.children[0];

                                // Copy each child of the first child to the top list
                                firstChild.children.forEach((child: Element) => {
                                    const copy = child.copyElement(startListContainer);

                                    if (copy) {
                                        startListContainer.children.splice(index, 0, copy);
                                        index++;
                                    }
                                });

                                // Delete the orginal first child
                                startListContainer.deleteChild(firstChild);
                            }


                            const endListContainer = topList.copyElement(topList.parent, { range: endRange });
                            if (endListContainer) topList.parent.children.splice(topListIndex + 1, 0, endListContainer);



                            topList.parent.deleteChild(topList);

                            i = selectedContainers.length - 1;
                        }
                    }


                    else {

                        // Second half of list is selected
                        if (lastContainerOfListIndex != -1) {
                            const startRange = new ElementRange();
                            const endRange = new ElementRange();
                            const topListIndex = topList.parent.children.findIndex(x => x == topList);

                            startRange.startElementId = topList.children[0].id;
                            startRange.endElementId = container.previousChild?.id as string;
                            endRange.startElementId = container.id;
                            endRange.endElementId = topList.lastChild.id;


                            const startListContainer = topList.copyElement(topList.parent, { range: startRange });
                            if (startListContainer) {
                                topList.parent.children.splice(topListIndex, 0, startListContainer);
                            }



                            const endListContainer = topList.copyElement(topList.parent, { range: endRange });
                            if (endListContainer) {
                                topList.parent.children.splice(topListIndex + 1, 0, endListContainer);

                                const firstChild = endListContainer.children[0];

                                // Copy each child of the first child to the top list
                                firstChild.children.forEach((child: Element) => {
                                    const copy = child.copyElement(endListContainer);

                                    if (copy) {
                                        endListContainer.children.push(copy);
                                    }
                                });

                                // Delete the orginal first child
                                endListContainer.deleteChild(firstChild);
                            }



                            topList.parent.deleteChild(topList);


                            i = lastContainerOfListIndex;
                        }

                        // Middle of list is selected
                        else {
                            const startRange = new ElementRange();
                            const middleRange = new ElementRange();
                            const endRange = new ElementRange();
                            const topListIndex = topList.parent.children.findIndex(x => x == topList);

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
                            const startListContainer = topList.copyElement(topList.parent, { range: startRange });
                            if (startListContainer) {
                                topList.parent.children.splice(topListIndex, 0, startListContainer);
                            }



                            // Middle
                            const middleListContainer = topList.copyElement(topList.parent, { range: middleRange });
                            if (middleListContainer) {
                                topList.parent.children.splice(topListIndex + 1, 0, middleListContainer);

                                const firstChild = middleListContainer.children[0];

                                // Copy each child of the first child to the top list
                                firstChild.children.forEach((child: Element) => {
                                    const copy = child.copyElement(middleListContainer);

                                    if (copy) {
                                        middleListContainer.children.push(copy);
                                    }
                                });

                                // Delete the orginal first child
                                middleListContainer.deleteChild(firstChild);
                            }




                            // End
                            const endListContainer = topList.copyElement(topList.parent, { range: endRange });
                            if (endListContainer) topList.parent.children.splice(topListIndex + 2, 0, endListContainer);


                            topList.parent.deleteChild(topList);


                            i = selectedContainers.length - 1;
                        }
                    }
                }
            }

        }

        this.text.selection.resetSelection(this.text.root, this.text.selection.startOffset, this.text.selection.endOffset);
        this.text.merge();
        this.text.render();
        this.finalizeStyle();
    }
}