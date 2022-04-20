import { NodeType } from "widgets";
import { CopyElementOptions } from "./copy-element-options";
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
    copyElement(parent: Element, options?: CopyElementOptions): Element | null {
        if (options && options.range && options.range.startElementId == this.id) {
            options.range.inRange = true;
        }

        if (!options || !options.range || options.range.inRange) {
            if (options && options.range?.endElementId == this.id) {
                options.range.inRange = false;
                options.range.inTopParentRange = false;
            }

            const breakElement = new BreakElement(parent);
            if (!options || !options.createNewChildId) breakElement.id = this.id;
            return breakElement;
        }

        return null;
    }
}