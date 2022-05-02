import { BreakElement } from "./break-element";
import { Element } from "./element";
import { ElementType } from "./element-type";
import { Selection } from "./selection";
import { SpanElement } from "./span-element";
import { StyleData } from "./style-data";
import { TextElement } from "./text-element";

export abstract class Style {
    public name!: string;
    public value!: string;

    constructor(protected selection: Selection) { }


    // ---------------------------------------------------------Is Style Selected------------------------------------------------------------------
    protected get isStyleSelected(): boolean {
        if (this.selection.selectedStyles.length > 0 && !(this.selection.selectedStyles.length == 1 && this.selection.selectedStyles[0].length == 0)) {
            return this.selection.selectedStyles.every(x => x.some(z => z.name == this.name && z.value == this.value));
        }

        return false;
    }





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


                currentElement = this.addStyle(currentElement, this.selection.startOffset, endOffset);
                if (this.selection.startElement == this.selection.endElement) break;
            }

            // If end element
            else if (currentElement.id == this.selection.endElement.id) {
                currentElement = this.addStyle(currentElement, 0, this.selection.endOffset);
                break;
            }

            // Other
            else {
                const endOffset = currentElement.elementType == ElementType.Text ? (currentElement as TextElement).text.length : 1;
                currentElement = this.addStyle(currentElement, 0, endOffset);
            }

            // Go to the next element
            const nextElement = currentElement.nextChild;
            if (nextElement) currentElement = nextElement;
        }
    }




    // ---------------------------------------------------------Add Style------------------------------------------------------------------
    protected addStyle(element: Element, startOffset: number, endOffset: number): Element {
        let newElement!: Element;

        if (element.elementType == ElementType.Text) {
            const textElement = element as TextElement;

            if (startOffset == 0 && endOffset < textElement.text.length) {
                newElement = this.addStyleAtBeginningOfText(textElement, endOffset);
            } else if (startOffset > 0 && endOffset < textElement.text.length) {
                newElement = this.addStyleToMiddleOfText(textElement, startOffset, endOffset);
            } else if (startOffset > 0 && endOffset == textElement.text.length) {
                newElement = this.addStyleAtEndOfText(textElement, startOffset);
            } else if (startOffset == 0 && endOffset == textElement.text.length) {
                newElement = this.addStyleToAllOfText(textElement);
            }
        } else {
            newElement = this.addStyleToContainer(element);
        }

        return newElement;
    }


    // -----------------------------------------------------------------Set Selection-------------------------------------------------------------
    protected setSelection(oldTextElement: TextElement, newTextElement: TextElement): void {
        if (oldTextElement == this.selection.startElement) {
            this.selection.startElement = newTextElement;
            this.selection.startOffset = 0;
        }

        if (oldTextElement == this.selection.endElement) {
            this.selection.endElement = newTextElement;
            this.selection.endOffset = newTextElement.text.length;
        }
    }



    // ---------------------------------------------------------Add Style At Beginning Of Text---------------------------------------------------
    protected addStyleAtBeginningOfText(textElement: TextElement, endOffset: number): Element {
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

        // Set the selection
        this.setSelection(textElement, newTextElement);

        return newTextElement;
    }





    // ---------------------------------------------------------Add Style To Middle Of Text---------------------------------------------------
    protected addStyleToMiddleOfText(textElement: TextElement, startOffset: number, endOffset: number): Element {
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

        // Set the selection
        this.setSelection(textElement, newTextElement);

        return newTextElement;
    }



    // ---------------------------------------------------------Add Style At End Of Text---------------------------------------------------
    protected addStyleAtEndOfText(textElement: TextElement, startOffset: number): Element {
        const endText = textElement.text.substring(startOffset);
        const styleElement = this.createStyleElement(textElement.parent);
        const index = textElement.index;
        const newTextElement = new TextElement(styleElement, endText);

        textElement.text = textElement.text.substring(0, startOffset);
        this.addStyleToElement(styleElement);
        styleElement.children.push(newTextElement);
        textElement.parent.children.splice(index + 1, 0, styleElement);

        // Set the selection
        this.setSelection(textElement, newTextElement);

        return newTextElement;
    }



    // ---------------------------------------------------------Add Style To All Of Text---------------------------------------------------
    protected addStyleToAllOfText(textElement: TextElement): Element {
        let newTextElement: TextElement;

        // If we already have a parent to add the style to
        if ((textElement.parent.elementType == ElementType.Span || textElement.parent.elementType == ElementType.Anchor) && textElement.parent.children.length == 1) {
            if (!textElement.parent.styles.some(x => x.name == this.name)) {
                this.addStyleToElement(textElement.parent);
            } else {
                const style = textElement.parent.styles.find(x => x.name == this.name);
                if (style) style.value = this.value;
            }

            newTextElement = textElement;

            // Create the style element and add the style
        } else {
            const index = textElement.index;
            const styleElement = this.createStyleElement(textElement.parent);
            newTextElement = textElement.copy(styleElement) as TextElement;

            this.addStyleToElement(styleElement);

            styleElement.children.push(newTextElement);
            textElement.parent.children.splice(index, 1, styleElement);

            // Set the selection
            this.setSelection(textElement, newTextElement);
        }

        return newTextElement;
    }



    // ---------------------------------------------------------Add Style To Container---------------------------------------------------
    protected addStyleToContainer(element: Element): Element {
        const child = element.firstChild;
        let newElement: Element;

        if (child.parent.elementType == ElementType.Span) {
            if (!child.parent.styles.some(x => x.name == this.name)) {
                this.addStyleToElement(child.parent);
            }

            newElement = element;
        } else {
            const styleElement = this.createStyleElement(child.parent);
            const newBreakElement = new BreakElement(styleElement);

            this.addStyleToElement(styleElement);
            styleElement.children.push(newBreakElement);
            child.parent.children.splice(0, 1, styleElement);

            newElement = newBreakElement;
        }

        return newElement;
    }



    // ---------------------------------------------------------Create Style Element----------------------------------------------------------
    protected createStyleElement(parent: Element): Element {
        return new SpanElement(parent);
    }




    // ---------------------------------------------------------Set Style To Element----------------------------------------------------------
    protected addStyleToElement(element: Element): void {
        element.styles.push(new StyleData(this.name, this.value));
    }



    // ---------------------------------------------------------Set Selected Style----------------------------------------------------------
    public abstract setSelectedStyle(): void;
}