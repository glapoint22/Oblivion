import { NodeType, StyleData } from "widgets";
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
    public commonAncestorContainer!: Element;
    public selectedStyles!: StyleData[][];
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





    



    // ---------------------------------------------------------Set Selection------------------------------------------------------------------
    public setSelection() {
        this.range = window.getSelection()?.getRangeAt(0) as Range;
        this.startOffset = this.range.startOffset;
        this.endOffset = this.range.endOffset;
        this.collapsed = this.range.collapsed;
        this.setStartEnd();
        this.setSelectedStyles();
    }





    // ---------------------------------------------------------Set Selected Styles------------------------------------------------------------------
    public setSelectedStyles(currentElement: Element = this.commonAncestorContainer, range: ElementRange = new ElementRange('', '', 0, '', 0, '')) {
        let done!: boolean;

        if (currentElement.id == this.startElement.id) {
            range.inRange = true;
            this.selectedStyles = [];
        }


        if (range.inRange) {
            if (currentElement.nodeType == NodeType.Text || currentElement.nodeType == NodeType.Br) {
                let styles: Array<StyleData> = new Array<StyleData>();

                let parent = currentElement.parent;
                while (true) {
                    styles = styles.concat(parent.styles);

                    if (parent.nodeType == NodeType.Div || parent.nodeType == NodeType.Li) {
                        break;
                    }

                    parent = parent.parent;
                }

                this.selectedStyles.push(styles);
            }
        }

        if (currentElement.id == this.endElement.id) return true;


        for (let i = 0; i < currentElement.children.length; i++) {
            const child = currentElement.children[i];

            done = this.setSelectedStyles(child, range);
            if (done) return true;
        }

        return done;
    }






    // ---------------------------------------------------------Set Start End------------------------------------------------------------------
    private setStartEnd(currentElement: Element = this.root as Element): boolean {
        let done!: boolean;

        if (this.range.startContainer.nodeType == Node.TEXT_NODE && this.range.startContainer.parentElement?.id == currentElement.id) {
            this.startElement = this.getTextElement(this.range.startContainer, currentElement);

            if (this.range.commonAncestorContainer == this.range.startContainer) {
                this.commonAncestorContainer = this.startElement;
            }
            

        } else if (currentElement.id == (this.range.startContainer as HTMLElement).id) {
            this.startElement = currentElement;
            
        }

        if (currentElement.id == (this.range.commonAncestorContainer as HTMLElement).id) {
            this.commonAncestorContainer = currentElement;
        }

        


        if (this.range.endContainer.nodeType == Node.TEXT_NODE && this.range.endContainer.parentElement?.id == currentElement.id) {
            this.endElement = this.getTextElement(this.range.endContainer, currentElement);

            return true;

        } else if (currentElement.id == (this.range.endContainer as HTMLElement).id) {
            this.endElement = currentElement;

            return true;
        }



        for (let i = 0; i < currentElement.children.length; i++) {
            const child = currentElement.children[i];

            done = this.setStartEnd(child);
            if (done) return true;
        }

        return done;
    }




    // ---------------------------------------------------------Get Text Element------------------------------------------------------------------
    private getTextElement(textNode: Node, parentElement: Element): Element {
        const htmlParentElement = textNode.parentElement;
        let index = 0;

        if (htmlParentElement) {
            for (let i = 0; i < htmlParentElement.childNodes.length; i++) {
                if (htmlParentElement.childNodes[i] == textNode) {
                    index = i;
                    break;
                }
            }
        }

        return parentElement.children[index];
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