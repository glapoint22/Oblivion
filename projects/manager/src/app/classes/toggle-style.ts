import { NodeType } from "widgets";
import { BreakElement } from "./break-element";
import { Element } from "./element";
import { Style } from "./style";
import { TextElement } from "./text-element";

export class ToggleStyle extends Style {
    private isRemoveStyle!: boolean;


    // ---------------------------------------------------------Set Style------------------------------------------------------------------
    public setStyle(): void {
        this.isRemoveStyle = this.hasStyle;

        super.setStyle();
    }





    // ---------------------------------------------------------Apply Style------------------------------------------------------------------
    protected applyStyle(element: Element, startOffset: number, endOffset: number): Element {
        if (this.isRemoveStyle) {
            return this.removeStyle(element, startOffset, endOffset);
        } else {
            return super.applyStyle(element, startOffset, endOffset);
        }
    }





    // ---------------------------------------------------------Remove Style------------------------------------------------------------------
    private removeStyle(element: Element, startOffset: number, endOffset: number): Element {
        let newElement!: Element;

        if (element.nodeType == NodeType.Text) {
            const textElement = element as TextElement

            if (startOffset == 0 && endOffset < textElement.text.length) {
                newElement = this.removeStyleAtBeginningOfText(textElement, endOffset);
            } else if (startOffset > 0 && endOffset < textElement.text.length) {
                newElement = this.removeStyleAtMiddleOfText(textElement, startOffset, endOffset);
            } else if (startOffset > 0 && endOffset == textElement.text.length) {
                newElement = this.removeStyleAtEndOfText(textElement, startOffset);
            } else if (startOffset == 0 && endOffset == textElement.text.length) {
                newElement = this.removeStyleFromAllOfText(textElement);
            }
        } else {
            newElement = this.removeStyleFromBreakElement(element);
        }

        return newElement;
    }




    // ---------------------------------------------------------Remove Style At Beginning Of Text----------------------------------------------------------
    private removeStyleAtBeginningOfText(textElement: TextElement, endOffset: number): TextElement {
        const startText = textElement.text.substring(0, endOffset);
        const endText = textElement.text.substring(endOffset);
        const index = textElement.parent.parent.children.findIndex(x => x == textElement.parent);
        const parentCopy = textElement.parent.copyElement(textElement.parent.parent, undefined, false);
        const styleIndex = textElement.parent.styles.findIndex(x => x.style == this.name);
        const childIndex = textElement.parent.children.findIndex(x => x == textElement);
        let newTextElement!: TextElement;

        if (parentCopy) {
            parentCopy.styles.splice(styleIndex, 1);

            if (parentCopy.styles.length == 0) {
                newTextElement = new TextElement(textElement.parent.parent, startText);
                textElement.parent.parent.children.splice(index, 0, newTextElement);
            } else {
                newTextElement = parentCopy.children[childIndex] as TextElement;
                newTextElement.text = startText;
                textElement.parent.parent.children.splice(index, 0, parentCopy);
            }
        }

        textElement.text = endText;

        return newTextElement;
    }



    // ---------------------------------------------------------Remove Style At Middle Of Text----------------------------------------------------------
    private removeStyleAtMiddleOfText(textElement: TextElement, startOffset: number, endOffset: number): TextElement {
        const startText = textElement.text.substring(0, startOffset);
        const middleText = textElement.text.substring(startOffset, endOffset);
        const endText = textElement.text.substring(endOffset);
        const index = textElement.parent.parent.children.findIndex(x => x == textElement.parent);
        const childIndex = textElement.parent.children.findIndex(x => x == textElement);
        const middleParent = textElement.parent.copyElement(textElement.parent.parent, undefined, false);
        const endParent = textElement.parent.copyElement(textElement.parent.parent, undefined, false);
        const styleIndex = textElement.parent.styles.findIndex(x => x.style == this.name);
        let newTextElement!: TextElement;

        textElement.text = startText;

        if (middleParent) {
            middleParent.styles.splice(styleIndex, 1);

            if (middleParent.styles.length == 0) {
                newTextElement = new TextElement(textElement.parent.parent, middleText);
                textElement.parent.parent.children.splice(index + 1, 0, newTextElement);
            } else {
                newTextElement = middleParent.children[childIndex] as TextElement;
                newTextElement.text = middleText;
                textElement.parent.parent.children.splice(index + 1, 0, middleParent);
            }
        }

        if (endParent) {
            (endParent.children[childIndex] as TextElement).text = endText;
            textElement.parent.parent.children.splice(index + 2, 0, endParent);
        }

        return newTextElement;
    }






    // ---------------------------------------------------------Remove Style At End Of Text----------------------------------------------------------
    private removeStyleAtEndOfText(textElement: TextElement, startOffset: number): TextElement {
        const endText = textElement.text.substring(startOffset);
        const index = textElement.parent.parent.children.findIndex(x => x == textElement.parent);
        const parentCopy = textElement.parent.copyElement(textElement.parent.parent, undefined, false);
        const styleIndex = textElement.parent.styles.findIndex(x => x.style == this.name);
        const childIndex = textElement.parent.children.findIndex(x => x == textElement);
        let newTextElement!: TextElement;

        textElement.text = textElement.text.substring(0, startOffset);

        if (parentCopy) {
            parentCopy.styles.splice(styleIndex, 1);

            if (parentCopy.styles.length == 0) {
                newTextElement = new TextElement(textElement.parent.parent, endText);
                textElement.parent.parent.children.splice(index + 1, 0, newTextElement);
            } else {
                newTextElement = parentCopy.children[childIndex] as TextElement;
                newTextElement.text = endText;
                textElement.parent.parent.children.splice(index + 1, 0, parentCopy);
            }
        }

        return newTextElement;
    }








    // ---------------------------------------------------------Remove Style From All Of Text----------------------------------------------------------
    private removeStyleFromAllOfText(textElement: TextElement): TextElement {
        const styleIndex = textElement.parent.styles.findIndex(x => x.style == this.name);

        textElement.parent.styles.splice(styleIndex, 1);

        if (textElement.parent.styles.length == 0) {
            const index = textElement.parent.parent.children.findIndex(x => x == textElement.parent);
            const newText = new TextElement(textElement.parent.parent, textElement.text);

            textElement.parent.parent.children.splice(index, 1, newText);

            return newText;
        }

        return textElement;
    }






    // ---------------------------------------------------------Remove Style From Break Element----------------------------------------------------------
    private removeStyleFromBreakElement(element: Element): Element {
        const styleIndex = element.parent.styles.findIndex(x => x.style == this.name);

        element.parent.styles.splice(styleIndex, 1);

        if (element.parent.styles.length == 0) {
            const newBreakElement = new BreakElement(element.parent.parent);

            element.parent.parent.children.splice(0, 1, newBreakElement);
            return newBreakElement;
        }

        return element;
    }
}