import { Element } from "./element";
import { ElementType } from "./element-type";

export class SpanElement extends Element {

    constructor(public parent: Element) {
        super();
        this.elementType = ElementType.Span;
    }


    // ---------------------------------------------------Generate Html-----------------------------------------------------
    public generateHtml(parent: HTMLElement, includeId?: boolean): void {
        const spanElement = document.createElement('span');

        this.setHtmlElement(spanElement, parent, includeId!);
    }


    // ---------------------------------------------------Create-----------------------------------------------------
    protected create(parent: Element): Element {
        return new SpanElement(parent);
    }
}