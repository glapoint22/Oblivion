import { ElementType } from "./element-type";
import { Style } from "./style";
import { TextElement } from "./text-element";

export abstract class Case extends Style {


    // ---------------------------------------------------------Set Style------------------------------------------------------------------
    public setStyle(): void {
        const text = this.setCase(this.getText()).replace(/\n/g, '');

        this.setText(text);
    }




    // ---------------------------------------------------------Get Text------------------------------------------------------------------
    private getText(): string {
        // If start and end elements are the same
        if (this.selection.startElement == this.selection.endElement) {
            const textElement = this.selection.startElement as TextElement;

            return textElement.text.substring(this.selection.startOffset, this.selection.endOffset);
        }

        let text: string = '';
        let currentElement = this.selection.startElement;
        let currentContainer = this.selection.startElement.container;

        // This will grab the text from each element and concatenate it into one string
        while (true) {
            // Start element
            if (currentElement.id == this.selection.startElement.id) {
                if (currentElement.elementType == ElementType.Text) {
                    text = (currentElement as TextElement).text.substring(this.selection.startOffset);
                }


                // End element
            } else if (currentElement.id == this.selection.endElement.id || currentElement.container.id == this.selection.endElement.id) {
                if (currentElement.elementType == ElementType.Text) {
                    if (currentElement.container != currentContainer) {
                        currentContainer = currentElement.container;
                        text += '\n';
                    }

                    text += (currentElement as TextElement).text.substring(0, this.selection.endOffset);
                }

                break;

                // Other elements
            } else {
                if (currentElement.elementType == ElementType.Text) {
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

        return text;
    }




    // ---------------------------------------------------------Set Text------------------------------------------------------------------
    private setText(text: string): void {
        // If start and end elements are the same
        if (this.selection.startElement == this.selection.endElement) {
            const textElement = this.selection.startElement as TextElement;

            textElement.text = textElement.text.substring(0, this.selection.startOffset) + text + textElement.text.substring(this.selection.endOffset);
        } else {
            let start: number = 0;
            let end: number = 0;
            let currentElement = this.selection.startElement;


            while (true) {

                // Start element
                if (currentElement.elementType == ElementType.Text && currentElement.id == this.selection.startElement.id) {
                    const textElement = currentElement as TextElement;

                    end = textElement.text.length - this.selection.startOffset;

                    // If the selection does not start from the beginning of the text
                    if (this.selection.startOffset != 0) {
                        textElement.text = textElement.text.substring(0, this.selection.startOffset);
                    } else {
                        textElement.text = '';
                    }

                    textElement.text += text.substring(start, end);



                    // End element
                } else if (currentElement.id == this.selection.endElement.id || currentElement.container.id == this.selection.endElement.id) {
                    if (currentElement.elementType != ElementType.Text) break;

                    const textElement = currentElement as TextElement;
                    let endText!: string;

                    start = end;
                    end = textElement.text.length + start;

                    // If the selection does not go to the end of the text
                    if (this.selection.endOffset != textElement.text.length) {
                        endText = textElement.text.substring(this.selection.endOffset);
                    }

                    textElement.text = text.substring(start, end);

                    // Add the end text if we have it
                    if (endText) textElement.text += endText;

                    break;


                    // Other elements
                } else if (currentElement.elementType == ElementType.Text) {

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



    }



    // ---------------------------------------------------------Set Case------------------------------------------------------------------
    protected abstract setCase(text: string): string;
}