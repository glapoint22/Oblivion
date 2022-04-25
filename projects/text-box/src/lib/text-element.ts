import { Element } from "./element";
import { ElementType } from "./element-type";

export class TextElement extends Element {

    constructor(public parent: Element, public text: string) {
        super();
        this.elementType = ElementType.Text;
    }


    // ---------------------------------------------------Generate Html-----------------------------------------------------
    public generateHtml(parent: HTMLElement, includeId?: boolean): void {
        const textNode = this.createTextNode();

        parent.appendChild(textNode);
    }



    // ---------------------------------------------------Create Text Node-----------------------------------------------------
    protected createTextNode(): Text {
        return document.createTextNode(this.text);
    }



    // ---------------------------------------------------Create-----------------------------------------------------
    protected create(parent: Element): Element {
        return new TextElement(parent, this.text);
    }




    // ---------------------------------------------------Delete-----------------------------------------------------
    public delete(startOffset?: number, endOffset?: number): void {
        if (!startOffset && !endOffset) {
            super.delete();
        } else {
            this.text = this.text.substring(startOffset!, endOffset);
        }
    }

}