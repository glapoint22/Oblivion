import { Element } from "./element";
import { ElementRange } from "./element-range";
import { ElementType } from "./element-type";
import { StyleData } from "./style-data";
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


    // ---------------------------------------------------On Selection-----------------------------------------------------
    public onSelection(rootElement: Element) {
        this.range = window.getSelection()?.getRangeAt(0) as Range;
        this.startOffset = this.range.startOffset;
        this.endOffset = this.range.endOffset;
        this.collapsed = this.range.collapsed;
        this.startElement = undefined!;
        this.endElement = undefined!;
        this.setStartEndElements(rootElement);
        this.getSelectedStyles();
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


    // ---------------------------------------------------Set Start End Elements-----------------------------------------------------
    private setStartEndElements(currentElement: Element): boolean {
        let done!: boolean;

        // Set the start element
        if (this.range.startContainer.nodeType == Node.TEXT_NODE && this.range.startContainer.parentElement?.id == currentElement.id) {
            this.startElement = this.getTextElement(this.range.startContainer, currentElement);
            this.startChildIndex = this.startElement.index;

            // Assign the common ancestor container if it's the same as the start container
            if (this.range.commonAncestorContainer == this.range.startContainer) {
                this.commonAncestorContainer = this.startElement;
            }

            if (this.endElement) return true;

        } else if (currentElement.id == (this.range.startContainer as HTMLElement).id) {
            this.startElement = currentElement;
            this.startChildIndex = -1;
        }


        // Assign the common ancestor container
        if (currentElement.id == (this.range.commonAncestorContainer as HTMLElement).id) {
            this.commonAncestorContainer = currentElement;
        }


        // Set the end element
        if (this.range.endContainer.nodeType == Node.TEXT_NODE && this.range.endContainer.parentElement?.id == currentElement.id) {
            this.endElement = this.getTextElement(this.range.endContainer, currentElement);
            this.endChildIndex = this.endElement.index;

            if (this.startElement) return true;

        } else if (currentElement.id == (this.range.endContainer as HTMLElement).id) {
            this.endElement = currentElement;
            this.endChildIndex = -1;

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





    // ---------------------------------------------------------Get Selected Styles------------------------------------------------------------------
    public getSelectedStyles(currentElement: Element = this.startElement.root, range: ElementRange = new ElementRange()): boolean {
        let done!: boolean;

        if (currentElement.id == this.startElement.id) {
            range.inRange = true;
            this.selectedStyles = [];
        }


        if (range.inRange) {
            if (currentElement.elementType == ElementType.Text || currentElement.elementType == ElementType.Break) {
                let styles: Array<StyleData> = new Array<StyleData>();

                let parent = currentElement.parent;
                while (true) {
                    for (let i = 0; i < parent.styles.length; i++) {
                        const style = parent.styles[i];

                        if (!styles.some(x => x.name == style.name && x.value != style.value)) {
                            styles.push(style);
                        }
                    }

                    if (parent.elementType == ElementType.Div || parent.elementType == ElementType.ListItem) {
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

            done = this.getSelectedStyles(child, range);
            if (done) return true;
        }

        return done;
    }





    // ---------------------------------------------------------Is Element In Range------------------------------------------------------------------
    public isInRange(elementId: string, range: ElementRange = new ElementRange(), currentElement: Element = this.commonAncestorContainer.root): boolean {
        let result!: boolean;

        for (let i = 0; i < currentElement.children.length; i++) {
            const child = currentElement.children[i];

            if (child.id == this.startElement.id) {
                range.inRange = true;
            }

            if (child.id == elementId) {
                if (range.inRange) {
                    if (child.id == this.endElement.id) {
                        if (this.endOffset != (this.endElement as TextElement).text.length) {
                            return false;
                        }
                    }

                    return true;
                }
                return false;
            }

            if (child.id == this.endElement.id) return false;

            result = this.isInRange(elementId, range, child);

            if (result != undefined && result == false || result == true) return result;
        }

        return result;
    }



    // ---------------------------------------------------------Reset Selection------------------------------------------------------------------
    public resetSelection(oldElement: Element, newElement: Element, preserveOffset?: boolean) {
        const oldStartElement = Element.search(this.startElement.id, oldElement);
        const oldEndElement = Element.search(this.endElement.id, oldElement);

        if (oldStartElement) {
            const newStartElement = newElement.elementType == ElementType.Text ? newElement : Element.search(oldStartElement.id, newElement);

            if (newStartElement) {
                this.startElement = newStartElement;
                if (!preserveOffset) this.startOffset = 0;
                this.startChildIndex = newStartElement.index;
            }
        }

        if (oldEndElement) {
            const newEndElement = newElement.elementType == ElementType.Text ? newElement : Element.search(oldEndElement.id, newElement);

            if (newEndElement) {
                this.endElement = newEndElement;
                if (!preserveOffset) this.endOffset = newEndElement.elementType == ElementType.Text ? (newEndElement as TextElement).text.length : 0;
                this.endChildIndex = newEndElement.index;
            }
        }
    }
}