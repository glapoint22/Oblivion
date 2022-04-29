import { BreakElement } from "./break-element";
import { Element } from "./element";
import { ElementType } from "./element-type";
import { Selection } from "./selection";
import { SpanElement } from "./span-element";
import { StyleData } from "./style-data";
import { TextElement } from "./text-element";

export class Style {
    public name!: string;
    public value!: string;

    constructor(protected selection: Selection) { }


    // ---------------------------------------------------------Set Style------------------------------------------------------------------
    public setStyle(): void {
        let currentElement = this.selection.startElement;

        while (true) {
            // If start element
            if (currentElement.id == this.selection.startElement.id) {
                let endOffset!: number;

                // Get the end offset
                if (currentElement.elementType == ElementType.Text) {
                    if (this.selection.startElement == this.selection.endElement) {
                        endOffset = this.selection.endOffset;
                    } else {
                        endOffset = (currentElement as TextElement).text.length;
                    }
                } else {
                    endOffset = 1;
                }


                this.addStyle(currentElement, this.selection.startOffset, endOffset);
                if (this.selection.startElement == this.selection.endElement) break;
            }

            // If end element
            else if (currentElement.id == this.selection.endElement.id) {
                this.addStyle(currentElement, 0, this.selection.endOffset);
                break;
            }

            // Other
            else {
                const endOffset = currentElement.elementType == ElementType.Text ? (currentElement as TextElement).text.length : 1;
                this.addStyle(currentElement, 0, endOffset);
            }

            // Go to the next element
            const nextElement = currentElement.nextChild;
            if (nextElement) currentElement = nextElement;
        }
    }




    // ---------------------------------------------------------Add Style------------------------------------------------------------------
    protected addStyle(element: Element, startOffset: number, endOffset: number): void {
        if (element.elementType == ElementType.Text) {
            const textElement = element as TextElement;

            if (startOffset == 0 && endOffset < textElement.text.length) {
                this.addStyleAtBeginningOfText(textElement, endOffset);
            } else if (startOffset > 0 && endOffset < textElement.text.length) {
                this.addStyleToMiddleOfText(textElement, startOffset, endOffset);
            } else if (startOffset > 0 && endOffset == textElement.text.length) {
                this.addStyleAtEndOfText(textElement, startOffset);
            } else if (startOffset == 0 && endOffset == textElement.text.length) {
                this.addStyleToAllOfText(textElement);
            }
        } else {
            this.addStyleToContainer(element);
        }
    }




    // ---------------------------------------------------------Add Style At Beginning Of Text---------------------------------------------------
    protected addStyleAtBeginningOfText(textElement: TextElement, endOffset: number): void {
        const startText = textElement.text.substring(0, endOffset);
        const endText = textElement.text.substring(endOffset);
        const index = textElement.index;
        const styleElement = this.createStyleElement(textElement.parent);
        const newTextElement = textElement.copy(styleElement) as TextElement;

        newTextElement.text = startText;
        this.addStyleToElement(styleElement);
        styleElement.children.push(newTextElement);
        textElement.parent.children.splice(index, 1, styleElement);
        textElement.parent.children.splice(index + 1, 0, new TextElement(textElement.parent, endText));
    }





    // ---------------------------------------------------------Add Style To Middle Of Text---------------------------------------------------
    protected addStyleToMiddleOfText(textElement: TextElement, startOffset: number, endOffset: number): void {
        const middleText = textElement.text.substring(startOffset, endOffset);
        const endText = textElement.text.substring(endOffset);
        const styleElement = this.createStyleElement(textElement.parent);
        const index = textElement.index;
        const newTextElement = new TextElement(styleElement, middleText);

        textElement.text = textElement.text.substring(0, startOffset);
        this.addStyleToElement(styleElement);
        styleElement.children.push(newTextElement);
        textElement.parent.children.splice(index + 1, 0, styleElement);
        textElement.parent.children.splice(index + 2, 0, new TextElement(textElement.parent, endText));
    }



    // ---------------------------------------------------------Add Style At End Of Text---------------------------------------------------
    protected addStyleAtEndOfText(textElement: TextElement, startOffset: number): void {
        const endText = textElement.text.substring(startOffset);
        const styleElement = this.createStyleElement(textElement.parent);
        const index = textElement.index;
        const newTextElement = new TextElement(styleElement, endText);

        textElement.text = textElement.text.substring(0, startOffset);
        this.addStyleToElement(styleElement);
        styleElement.children.push(newTextElement);
        textElement.parent.children.splice(index + 1, 0, styleElement);
    }



    // ---------------------------------------------------------Add Style To All Of Text---------------------------------------------------
    protected addStyleToAllOfText(textElement: TextElement): void {

        // If we already have a parent to add the style to
        if ((textElement.parent.elementType == ElementType.Span || textElement.parent.elementType == ElementType.Anchor) && textElement.parent.children.length == 1) {
            if (!textElement.parent.styles.some(x => x.name == this.name)) {
                this.addStyleToElement(textElement.parent);
            } else {
                const style = textElement.parent.styles.find(x => x.name == this.name);
                if (style) style.value = this.value;
            }

            // Create the style element and add the style
        } else {
            const index = textElement.index;
            const styleElement = this.createStyleElement(textElement.parent);
            const newTextElement = textElement.copy(styleElement) as TextElement;

            this.addStyleToElement(styleElement);

            styleElement.children.push(newTextElement);
            textElement.parent.children.splice(index, 1, styleElement);
        }
    }



    // ---------------------------------------------------------Add Style To Container---------------------------------------------------
    protected addStyleToContainer(element: Element): void {
        const child = element.firstChild;

        if (child.parent.elementType == ElementType.Span) {
            if (!child.parent.styles.some(x => x.name == this.name)) {
                this.addStyleToElement(child.parent);
            }
        } else {
            const styleElement = this.createStyleElement(child.parent);
            const newBreakElement = new BreakElement(styleElement);

            this.addStyleToElement(styleElement);
            styleElement.children.push(newBreakElement);
            child.parent.children.splice(0, 1, styleElement);
        }
    }



    // ---------------------------------------------------------Create Style Element----------------------------------------------------------
    protected createStyleElement(parent: Element): Element {
        return new SpanElement(parent);
    }




    // ---------------------------------------------------------Set Style To Element----------------------------------------------------------
    protected addStyleToElement(element: Element): void {
        element.styles.push(new StyleData(this.name, this.value));
    }
}