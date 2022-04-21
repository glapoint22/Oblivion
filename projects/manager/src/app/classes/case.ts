import { NodeType } from "widgets";
import { Element } from "./element";
import { Style } from "./style";
import { TextElement } from "./text-element";

export abstract class Case extends Style {

    // ---------------------------------------------------------Apply Style At Beginning Of Text----------------------------------------------------------
    protected applyStyleAtBeginningOfText(textElement: TextElement, endOffset: number): TextElement {
        const startText = this.setCase(textElement.text.substring(0, endOffset));
        const endText = textElement.text.substring(endOffset);

        textElement.text = startText + endText;

        return textElement;
    }




    // ---------------------------------------------------------Apply Style At Middle Of Text----------------------------------------------------------
    protected applyStyleAtMiddleOfText(textElement: TextElement, startOffset: number, endOffset: number): TextElement {
        const startText = textElement.text.substring(0, startOffset);
        const middleText = this.setCase(textElement.text.substring(startOffset, endOffset));
        const endText = textElement.text.substring(endOffset);

        textElement.text = startText + middleText + endText;

        return textElement;
    }




    // ---------------------------------------------------------Apply Style At End Of Text----------------------------------------------------------
    protected applyStyleAtEndOfText(textElement: TextElement, startOffset: number): TextElement {
        const startText = textElement.text.substring(0, startOffset);
        const endText = this.setCase(textElement.text.substring(startOffset));

        textElement.text = startText + endText;

        return textElement;
    }




    // ---------------------------------------------------------Apply Style To All Of Text----------------------------------------------------------
    protected applyStyleToAllOfText(textElement: TextElement): TextElement {
        textElement.text = this.setCase(textElement.text);

        return textElement;
    }


    // ---------------------------------------------------------Set Style------------------------------------------------------------------
    public setStyle(): void {
        if (this.text.selection.startElement == this.text.selection.endElement) {
            this.applyStyle(this.text.selection.startElement as TextElement, this.text.selection.startOffset, this.text.selection.endOffset);
        } else {
            this.setRangeStyle();
        }

        this.text.render();
        this.finalizeStyle();
    }




    // ---------------------------------------------------------Apply Style To Div Element----------------------------------------------------------
    protected applyStyleToDivElement(element: Element): Element {
        return element;
    }




    // ---------------------------------------------------------Set Range Style------------------------------------------------------------------
    protected setRangeStyle() {
        let currentElement = this.text.selection.startElement;
        let text: string = '';
        let currentContainer = this.text.selection.startElement.container;

        // This will grab the text from each element and concatenate it into one string
        while (true) {
            // Start element
            if (currentElement.id == this.text.selection.startElement.id) {
                if (currentElement.nodeType == NodeType.Text) {
                    text = (currentElement as TextElement).text.substring(this.text.selection.startOffset);
                }


                // End element
            } else if (currentElement.id == this.text.selection.endElement.id || currentElement.container.id == this.text.selection.endElement.id) {
                if (currentElement.nodeType == NodeType.Text) {
                    if (currentElement.container != currentContainer) {
                        currentContainer = currentElement.container;
                        text += '\n';
                    }

                    text += (currentElement as TextElement).text.substring(0, this.text.selection.endOffset);
                }

                break;

                // Other elements
            } else {
                if (currentElement.nodeType == NodeType.Text) {
                    if (currentElement.container != currentContainer) {
                        currentContainer = currentElement.container;
                        text += '\n';
                    }

                    text += (currentElement as TextElement).text;
                } else {
                    text += '\n';
                }
            }


            // Get the next element
            const nextElement = currentElement.nextChild;
            if (nextElement) currentElement = nextElement;
        }

        // Set the case
        text = this.setCase(text).replace(/\n/g, '');



        let start: number = 0;
        let end: number = 0;

        currentElement = this.text.selection.startElement;
        while (true) {

            // Start element
            if (currentElement.nodeType == NodeType.Text && currentElement.id == this.text.selection.startElement.id) {
                const textElement = currentElement as TextElement;

                end = textElement.text.length - this.text.selection.startOffset;

                // If the selection does not start from the beginning of the text
                if (this.text.selection.startOffset != 0) {
                    textElement.text = textElement.text.substring(0, this.text.selection.startOffset);
                } else {
                    textElement.text = '';
                }

                textElement.text += text.substring(start, end);



                // End element
            } else if (currentElement.id == this.text.selection.endElement.id || currentElement.container.id == this.text.selection.endElement.id) {
                if (currentElement.nodeType != NodeType.Text) break;

                const textElement = currentElement as TextElement;
                let endText!: string;

                start = end;
                end = textElement.text.length + start;

                // If the selection does not go to the end of the text
                if (this.text.selection.endOffset != textElement.text.length) {
                    endText = textElement.text.substring(this.text.selection.endOffset);
                }

                textElement.text = text.substring(start, end);

                // Add the end text if we have it
                if (endText) textElement.text += endText;

                break;


                // Other elements
            } else if (currentElement.nodeType == NodeType.Text) {

                const textElement = currentElement as TextElement;

                start = end;
                end = textElement.text.length + start;

                textElement.text = text.substring(start, end);

            }


            // Get the next element
            const nextElement = currentElement.nextChild;
            if (nextElement) currentElement = nextElement;
        }

    }


    // ---------------------------------------------------------Set Case------------------------------------------------------------------
    protected abstract setCase(text: string): string;


    public setSelectedStyle(): void {
    }
}