import { NodeType } from "widgets";
import { Element } from "./element";
import { ElementRange } from "./element-range";
import { Selection } from "./selection";
import { TextElement } from "./text-element";

export class BreakElement extends Element {

    constructor(parent: Element) {
        super(parent);
        this.nodeType = NodeType.Br;
    }


    createHtml(parent: HTMLElement): void {
        const breakElement = document.createElement('br');

        breakElement.id = this.id;
        parent.appendChild(breakElement);
    }


    getStartSelection(offset?: number): Selection {
        return this.container.getStartSelection(0);
    }



    createElement(parent: Element): Element {
        return new BreakElement(parent);
    }


    onKeydown(key: string, offset: number): Selection {
        const textElement = new TextElement(this.parent, key);

        this.parent.children = [];
        this.parent.children.push(textElement);

        return textElement.getStartSelection(1);
    }




    // ---------------------------------------------------Copy Element-----------------------------------------------------
    copyElement(parent: Element, range?: ElementRange, copyChildId = true): Element | null {
        if (range && range.startElementId == this.id) {
            range.inRange = true;
        }

        if (!range || range.inRange) {
            if (range?.endElementId == this.id) {
                range.inRange = false;
                range.inTopParentRange = false;
            }

            const breakElement = new BreakElement(parent);
            if (copyChildId) breakElement.id = this.id;
            return breakElement;
        }

        return null;
    }
}