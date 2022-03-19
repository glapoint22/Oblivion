import { NodeType } from "widgets";
import { Range } from "./range";
import { Element } from "./element";
import { SelectedElement } from "./selected-element";

export class SpanElement extends Element {

    constructor() {
        super();
        this.nodeType = NodeType.Span;
    }

    createHtml(parent: HTMLElement): void {
        const spanElement = document.createElement('span');

        this.setHtmlElement(spanElement, parent);
    }



    setSelectedElement(offset: number): SelectedElement {
        if (offset == 0) {
            return this.getFirstChild().setSelectedElement(offset);
        } else {
            return this.getLastChild().setSelectedElement(offset);
        }
    }


    onKeydown(key: string, offset: number): SelectedElement {
        let selectedElement!: SelectedElement;

        if (key == 'Delete') {
            const element = this.getFirstChild();

            selectedElement = element.onKeydown(key, offset);
        }

        return selectedElement;
    }


    createElement(): Element {
        return new SpanElement();
    }


    // copyElement(parent: Element, range?: CopyElementRange): Element | null {
    //     if (range && range.topParentId == this.id) range.inRange = true;

    //     if (!range || range.inRange) {
    //         const spanElement = new SpanElement();

    //         spanElement.parent = parent;
    //         spanElement.styles = this.styles;
    //         this.children.forEach((child: Element) => {
    //             const copiedElement = child.copyElement(spanElement);

    //             if (copiedElement) spanElement.children.push(copiedElement);
    //         });

    //         return spanElement;
    //     }

    //     return null;
    // }
}