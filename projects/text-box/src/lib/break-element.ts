import { Element } from "./element";
import { ElementRange } from "./element-range";
import { ElementType } from "./element-type";
import { Selection } from "./selection";
import { TextElement } from "./text-element";

export class BreakElement extends Element {

    constructor(public parent: Element) {
        super();
        this.elementType = ElementType.Break;
    }


    // ---------------------------------------------------Generate Html-----------------------------------------------------
    public generateHtml(parent: HTMLElement, isDev?: boolean): void {
        const breakElement = this.createHtmlBreakElement();

        this.setHtmlElement(breakElement, parent, isDev!);
    }


    // ---------------------------------------------------createBreakElement-----------------------------------------------------
    protected createHtmlBreakElement(): HTMLBRElement {
        return document.createElement('br');
    }



    // ---------------------------------------------------Create-----------------------------------------------------
    public create(parent: Element): Element {
        return new BreakElement(parent);
    }



    // ---------------------------------------------------On Text Input-----------------------------------------------------
    public onTextInput(text: string, selection: Selection): void {
        const textElement = new TextElement(this.parent, text);

        this.parent.children.splice(this.index, 1, textElement);
        textElement.setSelection(selection, text.length);
    }




    // ---------------------------------------------------Copy-----------------------------------------------------
    public copy(parent: Element, options?: { range?: ElementRange, preserveSelection?: Selection, preserveIds?: boolean }): Element {
        let newElement!: Element;

        if (options && options.range && options.range.startElementId == this.id) {
            options.range.inRange = true;
        }

        if (!options || !options.range || options.range.inRange) {
            if (options && options.range && options.range.endElementId == this.id) {
                options.range.inRange = false;
            }

            // Create the new element
            newElement = this.create(parent);

            // If we are preserving the selection
            if ((options && options.preserveSelection &&
                (options.preserveSelection.startElement.id == this.id ||
                    options.preserveSelection.endElement.id == this.id)) ||
                options && options.preserveIds) {

                newElement.id = this.id;
            }
        }

        return newElement!;
    }
}