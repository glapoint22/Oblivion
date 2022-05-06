import { Element } from "./element";
import { ElementDeleteStatus } from "./element-delete-status";
import { ElementType } from "./element-type";
import { Selection } from "./selection";

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
    public create(parent: Element): Element {
        return new SpanElement(parent);
    }


    // ---------------------------------------------------Delete-----------------------------------------------------
    public delete(startOffset?: number, endOffset?: number): ElementDeleteStatus {
        // Parent will delete this element
        if (startOffset == 0 && endOffset == 0) {
            return this.parent.delete(startOffset, endOffset);
        }

        // Delete this element
        return super.delete(startOffset, endOffset);
    }
}