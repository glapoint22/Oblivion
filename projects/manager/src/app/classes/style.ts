import { NodeType, StyleData } from "widgets";
import { BreakElement } from "./break-element";
import { Element } from "./element";
import { SpanElement } from "./span-element";
import { Text } from "./text";
import { TextElement } from "./text-element";

export class Style {
    public name!: string;
    public value!: string;
    get hasStyle(): boolean {
        let element = this.text.startElement;

        while (true) {
            if (!element.styles.some(x => x.style == this.name && x.value == this.value) &&
                !element.parent.styles.some(x => x.style == this.name && x.value == this.value) &&
                !element.container.styles.some(x => x.style == this.name && x.value == this.value)) return false;

            if (element == this.text.endElement) return true;

            element = element.nextChild as Element;
        }
    }

    constructor(public text: Text) { }





    // ---------------------------------------------------------Set Style------------------------------------------------------------------
    public setStyle(): void {
        if (this.text.range.collapsed) return;

        if (this.text.range.startContainer == this.text.range.endContainer) {
            this.text.startElement = this.text.endElement = this.applyStyle(this.text.startElement as TextElement, this.text.range.startOffset, this.text.range.endOffset);
        } else {
            this.setRangeStyle(this.text.startElement);
        }

        
        this.text.trumpy();
    }






    // ---------------------------------------------------------Set Range Style------------------------------------------------------------------
    private setRangeStyle(currentElement: Element) {
        if (currentElement == this.text.startElement) {
            currentElement = this.text.startElement =
                this.applyStyle(currentElement, this.text.range.startOffset, currentElement.nodeType == NodeType.Text ? (currentElement as TextElement).text.length : 1);
        } else if (currentElement == this.text.endElement) {
            this.text.endElement = this.applyStyle(currentElement, 0, this.text.range.endOffset);
            return;
        } else {
            currentElement = this.applyStyle(currentElement, 0, currentElement.nodeType == NodeType.Text ? (currentElement as TextElement).text.length : 1);
        }

        const nextElement = currentElement.nextChild;

        if (nextElement) this.setRangeStyle(nextElement);
    }










    // ---------------------------------------------------------Apply Style------------------------------------------------------------------
    protected applyStyle(element: Element, startOffset: number, endOffset: number): Element {
        let newElement!: Element;

        if (element.nodeType == NodeType.Text) {
            const textElement = element as TextElement;

            if (startOffset == 0 && endOffset < textElement.text.length) {
                newElement = this.applyStyleAtBeginningOfText(textElement, endOffset);
            } else if (startOffset > 0 && endOffset < textElement.text.length) {
                newElement = this.applyStyleAtMiddleOfText(textElement, startOffset, endOffset);
            } else if (startOffset > 0 && endOffset == textElement.text.length) {
                newElement = this.applyStyleAtEndOfText(textElement, startOffset);
            } else if (startOffset == 0 && endOffset == textElement.text.length) {
                newElement = this.applyStyleToAllOfText(textElement);
            }
        } else {
            newElement = this.applyStyleToBreakElement(element);
        }


        return newElement;
    }



    // ---------------------------------------------------------Apply Style At Beginning Of Text----------------------------------------------------------
    private applyStyleAtBeginningOfText(textElement: TextElement, endOffset: number): TextElement {
        const startText = textElement.text.substring(0, endOffset);
        const endText = textElement.text.substring(endOffset);
        const index = textElement.parent.children.findIndex(x => x == textElement);
        const spanElement = new SpanElement(textElement.parent);
        const newTextElement = textElement.copyElement(spanElement) as TextElement;

        newTextElement.text = startText;
        spanElement.styles.push(this.createStyleData());
        spanElement.children.push(newTextElement);
        textElement.parent.children.splice(index, 1, spanElement);
        textElement.parent.children.splice(index + 1, 0, new TextElement(textElement.parent, endText));

        return newTextElement;
    }






    // ---------------------------------------------------------Apply Style At Middle Of Text----------------------------------------------------------
    private applyStyleAtMiddleOfText(textElement: TextElement, startOffset: number, endOffset: number): TextElement {
        const middleText = textElement.text.substring(startOffset, endOffset);
        const endText = textElement.text.substring(endOffset);
        const spanElement = new SpanElement(textElement.parent);
        const index = textElement.parent.children.findIndex(x => x == textElement);
        const newTextElement = new TextElement(spanElement, middleText);

        textElement.text = textElement.text.substring(0, startOffset);
        spanElement.styles.push(this.createStyleData());
        spanElement.children.push(newTextElement);
        textElement.parent.children.splice(index + 1, 0, spanElement);
        textElement.parent.children.splice(index + 2, 0, new TextElement(textElement.parent, endText));

        return newTextElement;
    }






    // ---------------------------------------------------------Apply Style At End Of Text----------------------------------------------------------
    private applyStyleAtEndOfText(textElement: TextElement, startOffset: number): TextElement {
        const endText = textElement.text.substring(startOffset);
        const spanElement = new SpanElement(textElement.parent);
        const index = textElement.parent.children.findIndex(x => x == textElement);
        const newTextElement = new TextElement(spanElement, endText);

        textElement.text = textElement.text.substring(0, startOffset);
        spanElement.styles.push(this.createStyleData());
        spanElement.children.push(newTextElement);
        textElement.parent.children.splice(index + 1, 0, spanElement);

        return newTextElement;
    }





    // ---------------------------------------------------------Apply Style To All Of Text----------------------------------------------------------
    private applyStyleToAllOfText(textElement: TextElement): TextElement {
        if (textElement.parent.nodeType == NodeType.Span) {
            if (!textElement.parent.styles.some(x => x.style == this.name)) {
                textElement.parent.styles.push(this.createStyleData());
            }

            return textElement;
        } else {
            const index = textElement.parent.children.findIndex(x => x == textElement);
            const spanElement = new SpanElement(textElement.parent);
            const newTextElement = textElement.copyElement(spanElement) as TextElement;

            spanElement.styles.push(this.createStyleData());
            spanElement.children.push(newTextElement);
            textElement.parent.children.splice(index, 1, spanElement);

            return newTextElement;
        }
    }





    // ---------------------------------------------------------Apply Style To Break Element----------------------------------------------------------
    private applyStyleToBreakElement(element: Element): Element {
        if (element.parent.nodeType == NodeType.Span) {
            if (!element.parent.styles.some(x => x.style == this.name)) {
                element.parent.styles.push(this.createStyleData());
            }

            return element;
        } else {
            const spanElement = new SpanElement(element.parent);
            const newBreakElement = new BreakElement(spanElement);

            spanElement.styles.push(this.createStyleData());
            spanElement.children.push(newBreakElement);
            element.parent.children.splice(0, 1, spanElement);

            return newBreakElement;
        }
    }





    // ---------------------------------------------------------Create Style Data----------------------------------------------------------
    private createStyleData(): StyleData {
        return new StyleData(this.name, this.value);
    }
}