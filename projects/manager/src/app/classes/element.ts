import { NodeType, StyleData } from "widgets";
import { ElementDeleteOptions } from "./element-delete-options";
import { Selection } from "./selection";
import { SelectedElementOnDeletion } from "./enums";
import { CopyElementOptions } from "./copy-element-options";

export abstract class Element {
    public id!: string;
    public styles: Array<StyleData> = [];
    public children: Array<Element> = [];
    public isRoot!: boolean;
    public nodeType!: NodeType;
    public indent: number = 0;


    constructor(public parent: Element) {
        this.id = Math.random().toString(36).substring(2);
    }



    // ---------------------------------------------------Search-----------------------------------------------------
    public static search(elementId: string, elementToSearchIn: Element): Element | null {
        if (elementToSearchIn.id == elementId) return elementToSearchIn;

        for (let i = 0; i < elementToSearchIn.children.length; i++) {
            const element = elementToSearchIn.children[i];

            if (element.id == elementId) {
                return element;
            }

            if (element.children.length > 0) {
                const result = Element.search(elementId, element);

                if (result != null) {
                    return result;
                }
            }
        }

        return null;
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
        if (this.parent.isRoot) return this;
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
            // This will remove any lists
            // if ((this.nodeType == NodeType.Ol || this.nodeType == NodeType.Ul) && this.children.length == 1 && this.children[0].nodeType != NodeType.Li) {
            //     this.children[0].children.forEach((child: Element) => {
            //         const copiedElement = child.copyElement(this);

            //         if (copiedElement) {
            //             this.children.push(copiedElement);
            //         }
            //     });

            //     return this.deleteChild(this.children[0], deleteOptions);
            // }
        }

        return selectedChild;
    }






    // ---------------------------------------------------On Backspace-----------------------------------------------------   
    onBackspace(offset: number): Selection {
        const previousChild = this.previousChild;

        if (previousChild) {
            this.parent.deleteChild(this);
            return previousChild.getStartSelection(Infinity);
        }

        return this.getStartSelection(offset);
    }










    // ---------------------------------------------------On Delete-----------------------------------------------------   
    onDelete(offset: number): Selection {
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

                return this.firstChild.getStartSelection(offset);
            } else {
                nextElement = currentContainer.parent.deleteChild(currentContainer, { selectedChildOnDeletion: SelectedElementOnDeletion.Next });
                if (nextElement) return nextElement.getStartSelection();
            }
        }

        return this.getStartSelection();
    }







    // ---------------------------------------------------On Enter-----------------------------------------------------   
    onEnter(offset: number): Selection {
        const index = this.parent.children.findIndex(x => x == this);
        const element = this.copyElement(this.parent);
        let selection!: Selection;

        if (element) {
            this.parent.children.splice(index + 1, 0, element);
            selection = element.getStartSelection();
        }

        return selection;
    }









    // ---------------------------------------------------Copy Element-----------------------------------------------------
    copyElement(parent: Element, options?: CopyElementOptions): Element | null {
        if (options && options.range && (options.range.startElementId == this.id)) {
            options.range.inRange = true;
        // } else if (options && options.range && options.range.topParentId == this.id) {
        //     options.range.inTopParentRange = true;
        } else if (options && options.range && options.range.endElementId == this.id) {
            options.range.inRange = false;
        }

        if (!options || !options.range || options.range.inRange 
            || Element.search(options.range.startElementId, this)

            // || options.range.containerId == this.id || options.range.inTopParentRange

            // || !options.range.rangeEnded && (this.nodeType == NodeType.Ul || this.nodeType == NodeType.Ol)
        ) {
            const element = this.createElement(parent, options && options.changeType ? options.changeType : undefined);

            if (options && options.preserveId) element.id = this.id;


            this.styles.forEach((style: StyleData) => {
                element.styles.push(new StyleData(style.style, style.value));
            });

            this.children.forEach((child: Element) => {
                const copiedElement = child.copyElement(element, options);

                if (copiedElement) element.children.push(copiedElement);
            });

            return element;
        }

        return null;
    }




    // ---------------------------------------------------On Key Down-----------------------------------------------------
    onKeydown(key: string, offset: number): Selection {
        return this.firstChild.onKeydown(key, offset);
    }





    // ---------------------------------------------------Get Start Selection-----------------------------------------------------
    getStartSelection(startOffset?: number): Selection {
        const selection = new Selection();

        selection.startElement = this;
        selection.startOffset = 0;

        return selection;
    }


    // ---------------------------------------------------Get Start-End Selection-----------------------------------------------------
    getStartEndSelection(startOffset?: number, endOffset?: number): Selection {
        const selection = new Selection();

        selection.startElement = this;
        selection.startOffset = startOffset ? startOffset : 0;
        selection.endElement = this;
        selection.endOffset = endOffset ? endOffset : 0;

        return selection;
    }




    // ---------------------------------------------------Get End Selection-----------------------------------------------------
    getEndSelection(endOffset?: number): Selection {
        const selection = new Selection();

        selection.endElement = this;
        selection.endOffset = 0;

        return selection;
    }






    // ---------------------------------------------------Is Child Of-----------------------------------------------------
    isChildOf(parent: Element): boolean {
        let currentElement = this.parent;

        while (true) {
            if (currentElement == parent) return true;
            if (currentElement.nodeType == NodeType.Div || currentElement.nodeType == NodeType.Li) return false;

            currentElement = currentElement.parent;
        }
    }



    // ---------------------------------------------------------Get Top List-------------------------------------------------------------
    public getTopList(): Element {
        let container = this as Element;

        while (container.parent.nodeType != NodeType.Div) {
            container = container.parent;
        }

        return container;
    }



    abstract createHtml(parent: HTMLElement): void;
    abstract createElement(parent: Element, changeType?: NodeType): Element;
}