import { Element } from "./element";
import { ElementType } from "./element-type";
import { TextElement } from "./text-element";

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



    // ---------------------------------------------------On Text Input-----------------------------------------------------
    public onTextInput(text: string, offset: number): void {
        const textElement = new TextElement(this.parent, text);

        this.parent.children.splice(this.index, 1, textElement);
    }
}