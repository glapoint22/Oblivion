import { ElementDeleteStatus } from "./element-delete-status";
import { ElementRange } from "./element-range";
import { ElementType } from "./element-type";
import { Selection } from "./selection";
import { StyleData } from "./style-data";

export abstract class Element {
    public parent!: Element;
    public children: Array<Element> = [];
    public styles: Array<StyleData> = [];
    public indent: number = 0;
    public id: string;
    public elementType!: ElementType;
    public preserve!: boolean;

    constructor() {
        this.id = Math.random().toString(36).substring(2);
    }

    // ---------------------------------------------------Index-----------------------------------------------------
    public get index(): number {
        return this.parent.children.findIndex(x => x == this);
    }



    // ---------------------------------------------------Root-----------------------------------------------------
    public get root(): Element {
        let curentElement = this as Element;

        while (curentElement.elementType != ElementType.Root) {
            curentElement = curentElement.parent;
        }

        return curentElement;
    }



    // ---------------------------------------------------Container-----------------------------------------------------
    public get container(): Element {
        if (this.elementType == ElementType.Div || this.elementType == ElementType.ListItem) return this;
        if (this.parent.elementType == ElementType.Root) return this;
        if (this.parent.elementType == ElementType.Div || this.parent.elementType == ElementType.ListItem) return this.parent;

        return this.parent.container;
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



    // ---------------------------------------------------Previous Child-----------------------------------------------------   
    public get previousChild(): Element | undefined {
        if (this.elementType == ElementType.Root) return undefined;

        const index = this.index;

        if (index == 0) {
            return this.parent.previousChild;
        }

        return this.parent.children[index - 1].lastChild;
    }






    // ---------------------------------------------------Next Child-----------------------------------------------------   
    public get nextChild(): Element | undefined {
        if (this.elementType == ElementType.Root) return undefined;

        const index = this.index;

        if (index == this.parent.children.length - 1) {
            return this.parent.nextChild;
        }

        return this.parent.children[index + 1].firstChild;
    }



    // ---------------------------------------------------Set Html Element-----------------------------------------------------
    protected setHtmlElement(htmlElement: HTMLElement, parent: HTMLElement, includeId: boolean) {
        // Set the styles
        this.setStyles(htmlElement);

        // Assign the element id
        if (includeId) htmlElement.id = this.id;

        // Append this html element to the parent
        parent.appendChild(htmlElement);


        // Generate html for each child
        if (this.children.length > 0) {
            this.children.forEach((element: Element) => {
                element.generateHtml(htmlElement, includeId);
            });
        }
    }



    // ---------------------------------------------------Set Styles-----------------------------------------------------
    protected setStyles(htmlElement: HTMLElement) {
        if (this.styles) {
            this.styles.forEach((style: any) => {
                htmlElement.style[style.name] = style.value;
            });
        }
    }



    // ---------------------------------------------------Copy-----------------------------------------------------
    public copy(parent: Element, options?: { range?: ElementRange, preserveSelection?: Selection, preserveIds?: boolean }): Element {
        let newElement!: Element;

        if (options && options.range && options.range.startElementId == this.id) {
            options.range.inRange = true;
        } else if (options && options.range && options.range.endElementId == this.id) {
            options.range.inRange = false;
        }


        if (!options || !options.range || options.range.inRange || Element.search(options.range.startElementId, this)) {
            // Create the new element
            newElement = this.create(parent);

            // If we are preserving the selection
            if ((options && options.preserveSelection &&
                (options.preserveSelection.startElement.id == this.id ||
                    options.preserveSelection.endElement.id == this.id ||
                    Element.search(options.preserveSelection.startElement.id, this) ||
                    Element.search(options.preserveSelection.endElement.id, this))) ||
                options && options.preserveIds) {

                newElement.id = this.id;
            }

            // Copy the styles
            this.styles.forEach((style: StyleData) => {
                newElement.styles.push(new StyleData(style.name, style.value));
            });

            newElement.indent = this.indent;

            // Copy the children
            this.children.forEach((child: Element) => {
                const copiedChild = child.copy(newElement, options);

                if (copiedChild) newElement.children.push(copiedChild);
            });
        }

        return newElement;
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




    // ---------------------------------------------------Delete-----------------------------------------------------
    public delete(startOffset?: number, endOffset?: number): ElementDeleteStatus {
        // Delete this element
        this.parent.children.splice(this.index, 1);

        if (this.parent.children.length == 0) {

            // Don't delete parent if preserved
            if (this.parent.preserve) {
                this.parent.preserve = false;
                return ElementDeleteStatus.NotDeleted;
            } else {
                return this.parent.delete();
            }
        }

        return ElementDeleteStatus.Deleted;
    }



    // ---------------------------------------------------Move To-----------------------------------------------------
    public moveTo(container: Element, selection: Selection) {
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];

            child.lastChild.moveTo(container, selection);
            i--;
        }
    }




    // ---------------------------------------------------On Backspace Keydown-----------------------------------------------------
    public onBackspaceKeydown(selection: Selection): void {
        const previousChild = this.previousChild;

        if (previousChild) {
            this.delete();
            previousChild.setSelection(selection, Infinity);
        }
    }



    // ---------------------------------------------------On Delete keydown-----------------------------------------------------
    public onDeleteKeydown(selection: Selection): void {
        const nextChild = this.nextChild;

        if (nextChild) {
            this.delete();
            nextChild.setSelection(selection);
        }
    }



    // ---------------------------------------------------On Enter keydown-----------------------------------------------------
    public onEnterKeydown(selection: Selection): void {
        const container = this.container;
        const containerCopy = container.copy(container.parent);

        containerCopy.setSelection(selection);
        container.parent.children.splice(container.index + 1, 0, containerCopy);
    }



    // ---------------------------------------------------On Text Input-----------------------------------------------------
    public onTextInput(text: string, selection: Selection): void {
        this.lastChild.onTextInput(text, selection);
    }




    // ---------------------------------------------------Set Selection-----------------------------------------------------
    public setSelection(selection: Selection, offset?: number): void {
        selection.startElement = selection.endElement = this;
        selection.startChildIndex = selection.endChildIndex = -1;
        selection.startOffset = selection.endOffset = 0;
    }



    // ---------------------------------------------------------Get Top List-------------------------------------------------------------
    public getTopList(): Element {
        let container = this as Element;

        while (container.parent.elementType != ElementType.Div && container.parent.elementType != ElementType.Root) {
            container = container.parent;
        }

        return container;
    }


    // ---------------------------------------------------------Set Indent-------------------------------------------------------------
    public setIndent(value: number): void {
        this.indent = Math.max(0, this.indent + value);
    }



    // ---------------------------------------------------Generate Html-----------------------------------------------------
    public abstract generateHtml(parent: HTMLElement, includeId?: boolean): void;

    // ---------------------------------------------------Create-----------------------------------------------------
    public abstract create(parent: Element): Element;


}