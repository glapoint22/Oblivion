import { Element } from "./element";
import { ElementType } from "./element-type";

export class BreakElement extends Element {

    constructor(public parent: Element) {
        super();
        this.elementType = ElementType.Break;
    }


    // ---------------------------------------------------Generate Html-----------------------------------------------------
    public generateHtml(parent: HTMLElement, includeId?: boolean): void {
        const breakElement = this.createHtmlBreakElement();

        this.setHtmlElement(breakElement, parent, includeId!);
    }


    // ---------------------------------------------------createBreakElement-----------------------------------------------------
    protected createHtmlBreakElement(): HTMLBRElement {
        return document.createElement('br');
    }



    // ---------------------------------------------------Create-----------------------------------------------------
    protected create(parent: Element): Element {
        return new BreakElement(parent);
    }
}