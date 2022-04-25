import { Element } from "./element";

export class Selection {
    public startElement!: Element;
    public startOffset!: number;
    public startChildIndex: number = -1;
    public endElement!: Element;
    public endOffset!: number;
    public endChildIndex: number = -1;
    public collapsed!: boolean;
    public commonAncestorContainer!: Element;
    private range!: Range;


    // ---------------------------------------------------On Selection-----------------------------------------------------
    public onSelection(rootElement: Element) {
        this.range = window.getSelection()?.getRangeAt(0) as Range;
        this.startOffset = this.range.startOffset;
        this.endOffset = this.range.endOffset;
        this.collapsed = this.range.collapsed;
        this.setStartEndElements(rootElement);
    }



    // ---------------------------------------------------Set Start End Elements-----------------------------------------------------
    private setStartEndElements(currentElement: Element): boolean {
        let done!: boolean;

        // Set the start element
        if (this.range.startContainer.nodeType == Node.TEXT_NODE && this.range.startContainer.parentElement?.id == currentElement.id) {
            this.startElement = this.getTextElement(this.range.startContainer, currentElement);

            // Assign the common ancestor container if it's the same as the start container
            if (this.range.commonAncestorContainer == this.range.startContainer) {
                this.commonAncestorContainer = this.startElement;
            }

        } else if (currentElement.id == (this.range.startContainer as HTMLElement).id) {
            this.startElement = currentElement;
        }


        // Assign the common ancestor container
        if (currentElement.id == (this.range.commonAncestorContainer as HTMLElement).id) {
            this.commonAncestorContainer = currentElement;
        }


        // Set the end element
        if (this.range.endContainer.nodeType == Node.TEXT_NODE && this.range.endContainer.parentElement?.id == currentElement.id) {
            this.endElement = this.getTextElement(this.range.endContainer, currentElement);

            return true;

        } else if (currentElement.id == (this.range.endContainer as HTMLElement).id) {
            this.endElement = currentElement;

            return true;
        }


        // Loop through each child of the current element
        for (let i = 0; i < currentElement.children.length; i++) {
            const child = currentElement.children[i];

            done = this.setStartEndElements(child);
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
}