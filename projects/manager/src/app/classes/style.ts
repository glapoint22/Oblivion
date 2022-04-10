import { NodeType, StyleData } from "widgets";
import { BreakElement } from "./break-element";
import { Element } from "./element";
import { Selection } from "./selection";
import { SpanElement } from "./span-element";
import { Text } from "./text";
import { TextElement } from "./text-element";

export abstract class Style {
    public name!: string;
    public value!: string;
    public preventCollapsedStyling: boolean = true;
    get selectionHasStyle(): boolean {
        if (this.text.selection.selectedStyles.length > 0 && !(this.text.selection.selectedStyles.length == 1 && this.text.selection.selectedStyles[0].length == 0)) {
            return this.text.selection.selectedStyles.every(x => x.some(z => z.style == this.name && z.value == this.value));
        }

        return false;
    }

    constructor(public text: Text) { }


    // ---------------------------------------------------------Set Style------------------------------------------------------------------
    public setStyle(): void {
        if (this.preventCollapsedStyling && this.text.selection.collapsed) return;

        if (this.text.selection.startElement == this.text.selection.endElement) {
            const element = this.applyStyle(this.text.selection.startElement as TextElement, this.text.selection.startOffset, this.text.selection.endOffset);
            const selection = this.getStartEndSelection(element);

            this.text.selection.setStartSelection(selection);
        } else {
            this.setRangeStyle();
        }
    }



    // ---------------------------------------------------------Get Start End Selection------------------------------------------------------------------
    public getStartEndSelection(element: Element): Selection {
        return element.getStartEndSelection();
    }





    // ---------------------------------------------------------Get Start Selection------------------------------------------------------------------
    public getStartSelection(element: Element): Selection {
        return element.getStartSelection();
    }



    // ---------------------------------------------------------Get Start Selection------------------------------------------------------------------
    public getEndSelection(element: Element): Selection {
        return element.getEndSelection();
    }




    // ---------------------------------------------------------Reset Selection------------------------------------------------------------------
    public resetSelection() {
        this.text.selection.setRange();
        this.text.selection.setSelection();
        this.setSelectedStyle();
        this.text.setFocus();
    }




    // ---------------------------------------------------------Set Range Style------------------------------------------------------------------
    private setRangeStyle() {
        let currentElement = this.text.selection.startElement;
        let startSelection!: Selection;
        let endSelection!: Selection;

        while (true) {
            if (currentElement.id == this.text.selection.startElement.id) {
                currentElement = this.text.selection.startElement =
                    this.applyStyle(currentElement, this.text.selection.startOffset, currentElement.nodeType == NodeType.Text ? (currentElement as TextElement).text.length : 1);
                startSelection = this.getStartSelection(currentElement);
            } else if (currentElement.id == this.text.selection.endElement.id || currentElement.container.id == this.text.selection.endElement.id) {
                if (currentElement.container.id == this.text.selection.endElement.id) currentElement = currentElement.container;

                currentElement = this.applyStyle(currentElement, 0, this.text.selection.endOffset);
                endSelection = this.getEndSelection(currentElement);
                break;
            } else {
                currentElement = this.applyStyle(currentElement, 0, currentElement.nodeType == NodeType.Text ? (currentElement as TextElement).text.length : 1);
            }

            const nextElement = currentElement.nextChild;
            if (nextElement) currentElement = nextElement;
        }

        this.text.selection.setStartEndSelection(startSelection, endSelection);
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
            newElement = this.applyStyleToDivElement(element);
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
        if (textElement.parent.nodeType == NodeType.Span && textElement.parent.children.length == 1) {
            if (!textElement.parent.styles.some(x => x.style == this.name)) {
                textElement.parent.styles.push(this.createStyleData());
            } else {
                const style = textElement.parent.styles.find(x => x.style == this.name);
                if (style) style.value = this.value;
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
    private applyStyleToDivElement(element: Element): Element {
        const child = element.firstChild;

        if (child.parent.nodeType == NodeType.Span) {
            if (!child.parent.styles.some(x => x.style == this.name)) {
                child.parent.styles.push(this.createStyleData());
            }


        } else {
            const spanElement = new SpanElement(child.parent);
            const newBreakElement = new BreakElement(spanElement);

            spanElement.styles.push(this.createStyleData());
            spanElement.children.push(newBreakElement);
            child.parent.children.splice(0, 1, spanElement);

            return newBreakElement;
        }

        return element;
    }





    // ---------------------------------------------------------Create Style Data----------------------------------------------------------
    public createStyleData(): StyleData {
        return new StyleData(this.name, this.value);
    }


    public abstract setSelectedStyle(): void;
}