import { NodeType, Style } from "widgets";
import { Range } from "./range";
import { SelectedElementOnDeletion } from "./enums";
import { SelectedElement } from "./selected-element";

export abstract class Element {
    public id!: string;
    public parent!: Element;
    public styles!: Array<Style>;
    public children: Array<Element> = [];
    public isRoot!: boolean;
    public nodeType!: NodeType

    constructor() {
        this.id = Math.random().toString(36).substring(2);
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
    deleteChild(child: Element, deleteOptions?: {
        selectedChildOnDeletion?: SelectedElementOnDeletion,
        preserveContainer?: boolean
    }): Element {
        const index = this.children.findIndex(x => x == child);
        let selectedChild!: Element;

        // Previous
        if (deleteOptions && deleteOptions.selectedChildOnDeletion == SelectedElementOnDeletion.Previous) {
            selectedChild = this.children[index].getPreviousElement();
            if (!selectedChild.isRoot) selectedChild = selectedChild.getLastChild();

            // Next
        } else if (deleteOptions && deleteOptions.selectedChildOnDeletion == SelectedElementOnDeletion.Next) {
            selectedChild = this.children[index].getNextElement();
            if (!selectedChild.isRoot) selectedChild = selectedChild.getFirstChild();
        }

        this.children.splice(index, 1);


        if (this.children.length == 0) {
            if (!deleteOptions || !deleteOptions.preserveContainer || (this.nodeType != NodeType.Div && this.nodeType != NodeType.Li))
                return this.parent.deleteChild(this, deleteOptions);
        }

        return selectedChild;
    }





    // ---------------------------------------------------Get First Child-----------------------------------------------------
    getFirstChild(): Element {
        if (this.children.length == 0) return this;

        let child = this.children[0];

        if (child.children.length > 0) {
            child = child.getFirstChild();
        }

        return child;
    }






    // ---------------------------------------------------Get Last Child-----------------------------------------------------
    getLastChild(): Element {
        if (this.children.length == 0) return this;

        let child = this.children[this.children.length - 1];

        if (child.children.length > 0) {
            child = child.getLastChild();
        }

        return child;
    }








    // ---------------------------------------------------Get Container-----------------------------------------------------
    getContainer(): Element {
        if (this.parent.nodeType == NodeType.Div || this.parent.nodeType == NodeType.Li) return this.parent;

        return this.parent.getContainer();
    }







    // ---------------------------------------------------Get Top Parent-----------------------------------------------------
    getTopParent(): Element {
        if (this.parent.nodeType == NodeType.Div || this.parent.nodeType == NodeType.Li) return this;

        return this.parent.getTopParent();
    }







    // ---------------------------------------------------Get Previous Element-----------------------------------------------------   
    getPreviousElement(): Element {
        if (this.isRoot) return this;

        const index = this.parent.children.findIndex(x => x == this);

        if (index == 0) {
            return this.parent.getPreviousElement();
        }

        let element = this.parent.children[index - 1];
        if (element.children.length > 0) {
            element = element.children[element.children.length - 1];
        }

        return element;
    }







    // ---------------------------------------------------Get Next Element-----------------------------------------------------   
    getNextElement(): Element {
        if (this.isRoot) {
            return this;
        }

        const index = this.parent.children.findIndex(x => x == this);

        if (index == this.parent.children.length - 1) {
            return this.parent.getNextElement();
        }

        return this.parent.children[index + 1];
    }








    // ---------------------------------------------------On Backspace-----------------------------------------------------   
    onBackspace(offset: number): SelectedElement {
        const selectedElement = this.getPreviousElement();

        if (!selectedElement.isRoot) {
            this.parent.deleteChild(this);
            return selectedElement.getLastChild().setSelectedElement(Infinity);
        }

        return this.setSelectedElement(offset);
    }










    // ---------------------------------------------------On Delete-----------------------------------------------------   
    onDelete(offset: number): SelectedElement {
        let nextElement = this.getNextElement();

        if (!nextElement.isRoot) {
            nextElement = nextElement.getFirstChild();

            const currentContainer = this;
            const otherContainer = nextElement.getContainer();

            if (nextElement.nodeType == NodeType.Br) {
                this.deleteChild(this.children[0], { preserveContainer: true });

                otherContainer.children.forEach((element: Element) => {
                    const copiedElement = element.copyElement(currentContainer);

                    if (copiedElement) currentContainer.children.push();
                });


                otherContainer.parent.deleteChild(otherContainer);

                return this.getFirstChild().setSelectedElement(offset);
            } else {
                currentContainer.parent.deleteChild(currentContainer);
                return nextElement.setSelectedElement(0);
            }
        }

        return this.setSelectedElement(0);
    }







    // ---------------------------------------------------On Enter-----------------------------------------------------   
    onEnter(offset: number): SelectedElement {
        return new SelectedElement('', 0);
    }


    copyElement(parent: Element, range?: Range): Element | null {
        if (range && (range.startElementId == this.id || range.endElementId == this.id)) {
            range.inRange = true;
        } else if (range && range.topParentId == this.id) {
            range.hasAccess = true;
        }

        if (!range || range.inRange || range.containerId == this.id || range.hasAccess) {
            const element = this.createElement();

            element.parent = parent;
            element.styles = this.styles;
            this.children.forEach((child: Element) => {
                const copiedElement = child.copyElement(element, range);

                if (copiedElement) element.children.push(copiedElement);
            });

            return element;
        }

        return null;
    }


    abstract createHtml(parent: HTMLElement): void;
    abstract onKeydown(key: string, offset: number): SelectedElement;
    abstract setSelectedElement(offset: number): SelectedElement;
    abstract createElement(): Element;

    // abstract onTab(offset: number): SelectedElement;
}