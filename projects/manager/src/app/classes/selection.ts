import { Element } from "./element";
import { ElementRange } from "./element-range";
import { TextElement } from "./text-element";

export class Selection {
    public startElement!: Element;
    public startOffset!: number;
    public startChildIndex: number = -1;
    public endElement!: Element;
    public endOffset!: number;
    public endChildIndex: number = -1;
    public collapsed!: boolean;
    private range!: Range;


    constructor(private root?: Element) { }


    // ---------------------------------------------------------Set Start Selection------------------------------------------------------------------
    public setStartSelection(selection: Selection) {
        this.startElement = this.endElement = selection.startElement;
        this.startOffset = selection.startOffset;
        this.endOffset = selection.endOffset ? selection.endOffset : selection.startOffset;
        this.startChildIndex = this.endChildIndex = selection.startChildIndex;
    }


    // ---------------------------------------------------------Set End Selection------------------------------------------------------------------
    public setStartEndSelection(startSelection: Selection, endSelection: Selection) {
        this.startElement = startSelection.startElement;
        this.startOffset = startSelection.startOffset;
        this.startChildIndex = startSelection.startChildIndex;
        this.endElement = endSelection.endElement;
        this.endOffset = endSelection.endOffset;
        this.endChildIndex = endSelection.endChildIndex;
    }



    // ---------------------------------------------------------Set Range------------------------------------------------------------------
    public setRange(): void {
        let elementId = this.startChildIndex == -1 ? this.startElement.id : this.startElement.parent.id;

        let startNode = document.getElementById(elementId) as Node;
        if (this.startChildIndex != -1) startNode = startNode.childNodes[this.startChildIndex];

        elementId = this.endChildIndex == -1 ? this.endElement.id : this.endElement.parent.id;
        let endNode = document.getElementById(elementId) as Node;
        if (this.endChildIndex != -1) endNode = endNode.childNodes[this.endChildIndex];

        this.range.setStart(startNode, this.startOffset);
        this.range.setEnd(endNode, this.endOffset);
        this.collapsed = this.range.collapsed;
    }





    // ---------------------------------------------------------Get Element------------------------------------------------------------------
    private getElement(node: Node): Element {
        if (node.nodeType == Node.TEXT_NODE) {
            return this.getTextElement(node);
        }

        return Element.search((node as HTMLElement).id, this.root as Element) as Element;
    }









    // ---------------------------------------------------------Set Selection------------------------------------------------------------------
    public setSelection() {
        this.range = window.getSelection()?.getRangeAt(0) as Range;
        this.startElement = this.getElement(this.range.startContainer);
        this.endElement = this.getElement(this.range.endContainer);
        this.startOffset = this.range.startOffset;
        this.endOffset = this.range.endOffset;
        this.collapsed = this.range.collapsed;
    }




    // ---------------------------------------------------------Get Text Element------------------------------------------------------------------
    private getTextElement(node: Node): Element {
        const parentId = node.parentElement?.id as string
        const element = Element.search(parentId, this.root as Element) as Element;
        const parentElement = node.parentElement;
        let index = 0;

        if (parentElement) {
            for (let i = 0; i < parentElement.childNodes.length; i++) {
                if (parentElement.childNodes[i] == node) {
                    index = i;
                    break;
                }
            }
        }

        return element.children[index];
    }




    // ---------------------------------------------------------Reset Selection------------------------------------------------------------------
    public resetSelection() {
        const startElement = Element.search(this.startElement.id, this.startElement.container as Element);
        if (startElement && startElement != this.startElement) {
            this.startElement = startElement;
            this.startChildIndex = startElement.parent.children.findIndex(x => x == startElement);
            this.startOffset = 0;
        }

        const endElement = Element.search(this.endElement.id, this.endElement.container as Element);
        if (endElement && endElement != this.endElement) {
            this.endElement = endElement;
            this.endChildIndex = endElement.parent.children.findIndex(x => x == endElement);
            this.endOffset = (this.endElement as TextElement).text.length;
        }
    }



    // ---------------------------------------------------------Is In Range------------------------------------------------------------------
    public isInRange(elementId: string): boolean {
        return this.isElementInRange(elementId, new ElementRange('', this.startElement.id, 0, this.endElement.id, 0, ''), this.root as Element);
    }





    // ---------------------------------------------------------Is Element In Range------------------------------------------------------------------
    private isElementInRange(elementId: string, range: ElementRange, currentElement: Element): boolean {
        let result!: boolean;

        for (let i = 0; i < currentElement.children.length; i++) {
            const child = currentElement.children[i];

            if (child.id == range.startElementId) {
                range.inRange = true;
            }

            if (child.id == elementId) {
                if (range.inRange) {
                    if (child.id == range.endElementId) {
                        if (this.endOffset != (this.endElement as TextElement).text.length) {
                            return false;
                        }
                    }

                    return true;
                }
                return false;
            }

            if (child.id == range.endElementId) return false;

            result = this.isElementInRange(elementId, range, child);

            if (result != undefined && result == false || result == true) return result;
        }

        return result;
    }
}