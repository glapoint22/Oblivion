import { Container } from "./container";
import { Element } from "./element";
import { ElementType } from "./element-type";
import { Selection } from "./selection";

export class DivElement extends Container {

    constructor(public parent: Element) {
        super();
        this.elementType = ElementType.Div;
    }

    // ---------------------------------------------------Generate Html-----------------------------------------------------
    public generateHtml(parent: HTMLElement, includeId?: boolean): void {
        const divElement = document.createElement('div');

        if (this.indent > 0) divElement.style.textIndent = (this.indent * 40) + 20 + 'px';
        this.setHtmlElement(divElement, parent, includeId!);
    }



    // ---------------------------------------------------Create-----------------------------------------------------
    protected create(parent: Element): Element {
        return new DivElement(parent);
    }

}