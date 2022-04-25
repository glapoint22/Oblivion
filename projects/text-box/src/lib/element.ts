import { ElementRange } from "./element-range";
import { ElementType } from "./element-type";
import { Style } from "./style";

export abstract class Element {
    public parent!: Element;
    public children: Array<Element> = [];
    public styles: Array<Style> = [];
    public indent: number = 0;
    public id: string;
    protected elementType!: ElementType;

    constructor() {
        this.id = Math.random().toString(36).substring(2);
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
    public copy(newParent: Element, range?: ElementRange): Element {
        let newElement!: Element;

        if (range?.startElementId == this.id) {
            range.inRange = true;
        } else if (range?.endElementId == this.id) {
            range.inRange = false;
        }


        if (!range || range.inRange || Element.search(range.startElementId, this)) {
            // Create the new element
            newElement = this.create(newParent);

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
    public delete(startOffset?: number, endOffset?: number): void {
        const index = this.parent.children.findIndex(x => x == this);

        this.parent.children.splice(index, 1);
    }



    // ---------------------------------------------------Generate Html-----------------------------------------------------
    public abstract generateHtml(parent: HTMLElement, includeId?: boolean): void;





    // ---------------------------------------------------Create-----------------------------------------------------
    protected abstract create(parent: Element): Element;
}