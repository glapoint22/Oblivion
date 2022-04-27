import { ElementDeleteStatus } from "./element-delete-status";
import { ElementRange } from "./element-range";
import { ElementType } from "./element-type";
import { Style } from "./style";

export abstract class Element {
    public parent!: Element;
    public children: Array<Element> = [];
    public styles: Array<Style> = [];
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
    public copy(parent: Element, range?: ElementRange): Element {
        let newElement!: Element;

        if (range?.startElementId == this.id) {
            range.inRange = true;
        } else if (range?.endElementId == this.id) {
            range.inRange = false;
        }


        if (!range || range.inRange || Element.search(range.startElementId, this)) {
            // Create the new element
            newElement = this.create(parent);

            // Copy the styles
            this.styles.forEach((style: Style) => {
                newElement.styles.push(new Style(style.name, style.value));
            });

            // Copy the children
            this.children.forEach((child: Element) => {
                const copiedChild = child.copy(newElement, range);

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
    public moveTo(container: Element) {
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];

            child.lastChild.moveTo(container);
            i--;
        }
    }




    // ---------------------------------------------------On Backspace Keydown-----------------------------------------------------
    public onBackspaceKeydown(offset: number): void {
        this.delete();
    }



    // ---------------------------------------------------On Delete keydown-----------------------------------------------------
    public onDeleteKeydown(offset: number): void {
        this.delete();
    }



    // ---------------------------------------------------On Enter keydown-----------------------------------------------------
    public onEnterKeydown(offset: number): void {
        const container = this.container;

        container.parent.children.splice(this.index + 1, 0, container.copy(container.parent));
    }



    // ---------------------------------------------------On Text Input-----------------------------------------------------
    public onTextInput(text: string, offset: number): void {
        this.lastChild.onTextInput(text, offset);
    }



    // ---------------------------------------------------Generate Html-----------------------------------------------------
    public abstract generateHtml(parent: HTMLElement, includeId?: boolean): void;

    // ---------------------------------------------------Create-----------------------------------------------------
    protected abstract create(parent: Element): Element;
}