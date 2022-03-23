import { NodeType, Style } from "widgets";
import { ElementDeleteOptions } from "./element-delete-options";
import { ElementRange } from "./element-range";
import { SelectedElementOnDeletion } from "./enums";
import { SelectedElement } from "./selected-element";

export abstract class Element {
    public id!: string;
    public styles: Array<Style> = [];
    public children: Array<Element> = [];
    public isRoot!: boolean;
    public nodeType!: NodeType


    constructor(public parent: Element) {
        this.id = Math.random().toString(36).substring(2);
    }





    // ---------------------------------------------------First Child-----------------------------------------------------
    public get firstChild(): Element {
        if (this.children.length == 0) return this;

        let child = this.children[0];

        if (child.children.length > 0) {
            child = child.firstChild;
        }
        return child;
    }



    // ---------------------------------------------------Last Child-----------------------------------------------------
    public get lastChild(): Element {
        if (this.children.length == 0) return this;

        let child = this.children[this.children.length - 1];

        if (child.children.length > 0) {
            child = child.lastChild;
        }

        return child;
    }




    // ---------------------------------------------------Container-----------------------------------------------------
    public get container(): Element {
        if (this.parent.nodeType == NodeType.Div || this.parent.nodeType == NodeType.Li || this.parent.nodeType == NodeType.Ul || this.parent.nodeType == NodeType.Ol) return this.parent;

        return this.parent.container;
    }






    // ---------------------------------------------------Top Parent-----------------------------------------------------
    public get topParent(): Element {
        if (this.parent.nodeType == NodeType.Div || this.parent.nodeType == NodeType.Li) return this;

        return this.parent.topParent;
    }




    // ---------------------------------------------------Previous Child-----------------------------------------------------   
    public get previousChild(): Element | undefined {
        if (this.isRoot) return undefined;

        const index = this.parent.children.findIndex(x => x == this);

        if (index == 0) {
            return this.parent.previousChild;
        }

        return this.parent.children[index - 1].lastChild;
    }






    // ---------------------------------------------------Next Child-----------------------------------------------------   
    public get nextChild(): Element | undefined {
        if (this.isRoot) return undefined;

        const index = this.parent.children.findIndex(x => x == this);

        if (index == this.parent.children.length - 1) {
            return this.parent.nextChild;
        }

        return this.parent.children[index + 1].firstChild;
    }





    // ---------------------------------------------------Set Styles-----------------------------------------------------
    setStyles(htmlElement: HTMLElement) {
        if (this.styles) {
            this.styles.forEach((x: any) => {
                htmlElement.style[x.style] = x.value;
            });
        }
    }






    // ---------------------------------------------------Set Html Element-----------------------------------------------------
    setHtmlElement(htmlElement: HTMLElement, parent: HTMLElement) {
        htmlElement.id = this.id;
        parent.appendChild(htmlElement);

        this.setStyles(htmlElement);

        if (this.children.length > 0) {
            this.children.forEach((element: Element) => {
                element.createHtml(htmlElement);
            });
        }
    }






    // ---------------------------------------------------Delete Child-----------------------------------------------------
    deleteChild(child: Element, deleteOptions?: ElementDeleteOptions): Element | undefined {
        const index = this.children.findIndex(x => x == child);
        let selectedChild!: Element | undefined;

        // Previous
        if (deleteOptions && deleteOptions.selectedChildOnDeletion == SelectedElementOnDeletion.Previous) {
            selectedChild = this.children[index].previousChild;

            // Next
        } else if (deleteOptions && deleteOptions.selectedChildOnDeletion == SelectedElementOnDeletion.Next) {
            selectedChild = this.children[index].nextChild;
        }

        this.children.splice(index, 1);


        if (this.children.length == 0) {
            if (!deleteOptions || !deleteOptions.preserveContainer || (this.nodeType != NodeType.Div && this.nodeType != NodeType.Li))
                return this.parent.deleteChild(this, deleteOptions);
        }
        else {
            // This will remove any list items
            if ((this.nodeType == NodeType.Ol || this.nodeType == NodeType.Ul) && this.children.length == 1 && this.children[0].nodeType != NodeType.Li) {
                this.children[0].children.forEach((child: Element) => {
                    const copiedElement = child.copyElement(this);

                    if (copiedElement) {
                        this.children.push(copiedElement);
                    }
                });

                return this.deleteChild(this.children[0], deleteOptions);
            }
        }

        return selectedChild;
    }






    // ---------------------------------------------------On Backspace-----------------------------------------------------   
    onBackspace(offset: number): SelectedElement {
        const previousChild = this.previousChild;

        if (previousChild) {
            this.parent.deleteChild(this);
            return previousChild.setSelectedElement(Infinity);
        }

        return this.setSelectedElement(offset);
    }










    // ---------------------------------------------------On Delete-----------------------------------------------------   
    onDelete(offset: number): SelectedElement {
        let nextElement = this.nextChild;

        if (nextElement) {
            const currentContainer = this;
            const otherContainer = nextElement.container;

            if (nextElement.nodeType == NodeType.Br) {
                currentContainer.deleteChild(currentContainer.firstChild, { preserveContainer: true });

                otherContainer.children.forEach((element: Element) => {
                    const copiedElement = element.copyElement(currentContainer);

                    if (copiedElement) currentContainer.children.push(copiedElement);
                });


                otherContainer.parent.deleteChild(otherContainer);

                return this.firstChild.setSelectedElement(offset);
            } else {
                currentContainer.parent.deleteChild(currentContainer);
                return nextElement.setSelectedElement(0);
            }
        }

        return this.setSelectedElement(0);
    }







    // ---------------------------------------------------On Enter-----------------------------------------------------   
    onEnter(offset: number): SelectedElement {
        const index = this.parent.children.findIndex(x => x == this);
        const element = this.copyElement(this.parent);
        let selectedElement!: SelectedElement;

        if (element) {
            this.parent.children.splice(index + 1, 0, element);
            selectedElement = element.setSelectedElement(0);
        }

        return selectedElement;
    }









    // ---------------------------------------------------Copy Element-----------------------------------------------------   
    copyElement(parent: Element, range?: ElementRange): Element | null {
        if (range && (range.startElementId == this.id || range.endElementId == this.id)) {
            range.inRange = true;
        } else if (range && range.topParentId == this.id) {
            range.inTopParentRange = true;
        }

        if (!range || range.inRange || range.containerId == this.id || range.inTopParentRange) {
            const element = this.createElement(parent);

            element.styles = this.styles;
            this.children.forEach((child: Element) => {
                const copiedElement = child.copyElement(element, range);

                if (copiedElement) element.children.push(copiedElement);
            });

            return element;
        }

        return null;
    }




    onKeydown(key: string, offset: number): SelectedElement {
        return this.firstChild.onKeydown(key, offset);
    }


    setSelectedElement(offset: number): SelectedElement {
        return new SelectedElement(this.id, 0);
    }


    abstract createHtml(parent: HTMLElement): void;
    abstract createElement(parent: Element): Element;
}