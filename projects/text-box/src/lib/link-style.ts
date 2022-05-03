import { AnchorElement } from "./anchor-element";
import { BreakElement } from "./break-element";
import { Element } from "./element";
import { ElementType } from "./element-type";
import { Link } from "./link";
import { Selection } from "./selection";
import { SpanElement } from "./span-element";
import { TextElement } from "./text-element";
import { ToggleStyle } from "./toggle-style";

export class LinkStyle extends ToggleStyle {
    private link!: Link;
    private isRemoveLink!: boolean;

    constructor(selection: Selection) {
        super(selection);

        this.name = 'link';
    }

    // ---------------------------------------------------------Is Style Selected------------------------------------------------------------------
    protected get styleSelected(): boolean {
        if (this.isRemoveLink) {
            return true;
        }

        return false;
    }


    // ---------------------------------------------------------Set Style------------------------------------------------------------------
    public setStyle(): void {
        super.setStyle();
        if (this.isRemoveLink) this.isRemoveLink = false;
    }


    // ---------------------------------------------------------Create Style Element----------------------------------------------------------
    protected createStyleElement(parent: Element): Element {
        return new AnchorElement(parent, this.link);
    }


    // ---------------------------------------------------------Add Style To Element----------------------------------------------------------
    protected addStyleToElement(element: Element): Element {
        let newElement = element;

        if (element.elementType == ElementType.Span) {
            const styleElement = this.createStyleElement(element.parent);
            const index = element.index;

            styleElement.styles = element.styles;
            element.children.forEach((child: Element) => {
                const copiedElement = child.copy(styleElement);

                styleElement.children.push(copiedElement);
            });

            element.parent.children.splice(index, 1, styleElement);
            newElement = styleElement;
        }

        return newElement;
    }


    // ---------------------------------------------------------Remove Link----------------------------------------------------------
    public removeLink() {
        this.isRemoveLink = true;

        super.setStyle();
    }



    // ---------------------------------------------------------Get Style Parent----------------------------------------------------------
    protected getStyleParent(textElement: TextElement): Element | null {
        let styleParent = textElement.parent;

        while (styleParent.elementType != ElementType.Anchor) {
            styleParent = styleParent.parent;

            // If the style is not found, return
            if (styleParent.elementType == ElementType.Div || styleParent.elementType == ElementType.ListItem) return null;
        }

        return styleParent;
    }



    // ---------------------------------------------------------Remove Children From Style Parent----------------------------------------------------------
    protected removeChildrenFromStyleParent(styleParent: Element, styleParentIndex: number, textElementId: string): void {
        let index = styleParentIndex + 1;

        // If there are no styles on the style parent copy, move the children outside the style parent copy
        if (styleParent.styles.length == 0) {
            styleParent.children.forEach((child: Element) => {
                const childCopy = child.copy(styleParent.parent, undefined, textElementId);

                if (childCopy) styleParent.parent.children.splice(index, index == styleParentIndex + 1 ? 1 : 0, childCopy);

                index++;
            });

            // We have styles on the style parent copy
            // so we have to create a span element to hold the styles and children from the style parent copy
        } else {
            const spanElement = new SpanElement(styleParent.parent);

            spanElement.styles = styleParent.styles;
            styleParent.children.forEach((child: Element) => {
                const childCopy = child.copy(spanElement, undefined, textElementId);

                if (childCopy) spanElement.children.push(childCopy);
            });

            spanElement.parent.children.splice(index, 1, spanElement);
        }
    }


    // ---------------------------------------------------------Remove Style At Beginning Of Text----------------------------------------------------------
    protected removeStyleAtBeginningOfText(textElement: TextElement, endOffset: number): Element {
        const startText = textElement.text.substring(0, endOffset);
        const endText = textElement.text.substring(endOffset);
        let newTextElement!: TextElement;

        if (textElement.parent.elementType == ElementType.Anchor && textElement.parent.children.length == 1) {
            const index = textElement.parent.index;

            if (textElement.parent.styles.length == 0) {
                newTextElement = new TextElement(textElement.parent.parent, startText);
                textElement.parent.parent.children.splice(index, 0, newTextElement);
            } else {
                const spanElement = new SpanElement(textElement.parent.parent);

                spanElement.styles = textElement.parent.styles;
                newTextElement = new TextElement(spanElement, startText);
                spanElement.children.push(newTextElement);
                textElement.parent.parent.children.splice(index, 0, spanElement);
            }

            textElement.text = endText;

            this.setSelection(textElement, newTextElement);

            return newTextElement;
        }

        newTextElement = this.getBeginningText(textElement, startText, endText);
        return this.removeTopStyle(newTextElement);
    }





    // ---------------------------------------------------------Remove Style From Middle Of Text----------------------------------------------------------
    protected removeStyleFromMiddleOfText(textElement: TextElement, startOffset: number, endOffset: number): Element {
        const startText = textElement.text.substring(0, startOffset);
        const middleText = textElement.text.substring(startOffset, endOffset);
        const endText = textElement.text.substring(endOffset);
        let newTextElement!: TextElement;


        if (textElement.parent.elementType == ElementType.Anchor && textElement.parent.children.length == 1) {
            const index = textElement.parent.index;
            const childIndex = textElement.index;
            const endParent = textElement.parent.copy(textElement.parent.parent);

            textElement.text = startText;

            if (textElement.parent.styles.length == 0) {
                newTextElement = new TextElement(textElement.parent.parent, middleText);
                textElement.parent.parent.children.splice(index + 1, 0, newTextElement);
            } else {
                const spanElement = new SpanElement(textElement.parent.parent);

                spanElement.styles = textElement.parent.styles;
                newTextElement = new TextElement(spanElement, middleText);
                spanElement.children.push(newTextElement);
                textElement.parent.parent.children.splice(index + 1, 0, spanElement);
            }

            (endParent.children[childIndex] as TextElement).text = endText;
            textElement.parent.parent.children.splice(index + 2, 0, endParent);

            this.setSelection(textElement, newTextElement);

            return newTextElement;
        }

        newTextElement = this.getMiddleText(textElement, startText, middleText, endText);

        return this.removeTopStyle(newTextElement);
    }






    // ---------------------------------------------------------Remove Style At End Of Text----------------------------------------------------------
    protected removeStyleAtEndOfText(textElement: TextElement, startOffset: number): Element {
        const startText = textElement.text.substring(0, startOffset);
        const endText = textElement.text.substring(startOffset);
        let newTextElement!: TextElement;

        if (textElement.parent.elementType == ElementType.Anchor && textElement.parent.children.length == 1) {
            const index = textElement.parent.index;

            textElement.text = startText;

            if (textElement.parent.styles.length == 0) {
                newTextElement = new TextElement(textElement.parent.parent, endText);
                textElement.parent.parent.children.splice(index + 1, 0, newTextElement);
            } else {
                const spanElement = new SpanElement(textElement.parent.parent);

                spanElement.styles = textElement.parent.styles;
                newTextElement = new TextElement(spanElement, endText);
                spanElement.children.push(newTextElement);
                textElement.parent.parent.children.splice(index + 1, 0, spanElement);
            }

            this.setSelection(textElement, newTextElement);
            return newTextElement;
        }

        newTextElement = this.getEndText(textElement, startText, endText);
        return this.removeTopStyle(newTextElement);
    }



    // ---------------------------------------------------------Remove Style From All Of Text----------------------------------------------------------
    protected removeStyleFromAllOfText(textElement: TextElement): Element {
        let newTextElement!: TextElement;

        if (textElement.parent.elementType == ElementType.Anchor && textElement.parent.children.length == 1) {
            const index = textElement.parent.index;

            if (textElement.parent.styles.length == 0) {
                newTextElement = new TextElement(textElement.parent.parent, textElement.text);
                textElement.parent.parent.children.splice(index, 1, newTextElement);
            } else {
                const spanElement = new SpanElement(textElement.parent.parent);

                spanElement.styles = textElement.parent.styles;
                newTextElement = new TextElement(spanElement, textElement.text);
                spanElement.children.push(newTextElement);
                textElement.parent.parent.children.splice(index, 1, spanElement);
            }

            this.setSelection(textElement, newTextElement);
            return newTextElement;
        }

        return this.removeTopStyle(textElement);
    }




    // ---------------------------------------------------------Remove Style From Container------------------------------------------------------------------
    protected removeStyleFromContainer(element: Element): Element {
        const child = element.firstChild;
        const container = element.container;
        let newBreakElement!: BreakElement;

        if (child.parent.styles.length == 0) {
            newBreakElement = new BreakElement(container);

            container.children.splice(0, 1, newBreakElement);
        } else {
            const spanElement = new SpanElement(element.parent.parent);

            spanElement.styles = element.parent.styles;
            newBreakElement = new BreakElement(spanElement);
            spanElement.children.push(newBreakElement);
            element.parent.parent.children.splice(0, 1, spanElement);
        }

        this.setContainerSelection(element, container);

        return newBreakElement;
    }
}