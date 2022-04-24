import { Link, NodeType } from "widgets";
import { AnchorElement } from "./anchor-element";
import { Element } from "./element";
import { SpanElement } from "./span-element";
import { Text } from "./text";
import { TextElement } from "./text-element";
import { ToggleStyle } from "./toggle-style";

export class LinkStyle extends ToggleStyle {
    private link!: Link;

    constructor(text: Text) {
        super(text);

        this.name = 'link';
    }

    private isRemoveLink!: boolean;


    // ---------------------------------------------------------Create Style Element----------------------------------------------------------
    protected createStyleElement(parent: Element): Element {
        return new AnchorElement(parent, this.link);
    }


    // ---------------------------------------------------------Set Style To Element----------------------------------------------------------
    protected setStyleToElement(element: Element): Element {
        let newElement = element;

        if (element.nodeType == NodeType.Span) {
            const styleElement = this.createStyleElement(element.parent);
            const index = element.parent.children.findIndex(x => x == element);

            styleElement.styles = element.styles;
            element.children.forEach((child: Element) => {
                const copiedElement = child.copyElement(styleElement);

                if (copiedElement) {
                    styleElement.children.push(copiedElement);
                }
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


    // ---------------------------------------------------------Selection Has Style----------------------------------------------------------
    selectionHasStyle(): boolean {
        if (this.isRemoveLink) {
            this.isRemoveLink = false;
            return true;
        }

        return false;
    }





    // ---------------------------------------------------------Remove Style At Beginning Of Text----------------------------------------------------------
    protected removeStyleAtBeginningOfText(textElement: TextElement, endOffset: number): TextElement {
        const startText = textElement.text.substring(0, endOffset);
        const endText = textElement.text.substring(endOffset);
        let newTextElement!: TextElement;

        if (textElement.parent.nodeType == NodeType.A) {
            const index = textElement.parent.parent.children.findIndex(x => x == textElement.parent);

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

            return newTextElement;
        }

        const topParent = textElement.parent.parent;
        const startCopy = textElement.parent.copyElement(topParent);
        const endCopy = textElement.parent.copyElement(topParent, { createNewChildId: true });
        const index = topParent.children.findIndex(x => x == (textElement.parent));

        if (startCopy) {
            newTextElement = startCopy.firstChild as TextElement;
            newTextElement.text = startText;
            topParent.children.splice(index, 1, startCopy);
        }


        if (endCopy) {
            (endCopy.firstChild as TextElement).text = endText;
            topParent.children.splice(index + 1, 0, endCopy);
        }


        this.text.selection.resetSelection();
        return this.removeTopStyle(newTextElement);
    }




    // ---------------------------------------------------------Remove Style At Middle Of Text----------------------------------------------------------
    protected removeStyleAtMiddleOfText(textElement: TextElement, startOffset: number, endOffset: number): TextElement {
        const startText = textElement.text.substring(0, startOffset);
        const middleText = textElement.text.substring(startOffset, endOffset);
        const endText = textElement.text.substring(endOffset);
        let newTextElement!: TextElement;


        if (textElement.parent.nodeType == NodeType.A) {
            const index = textElement.parent.parent.children.findIndex(x => x == textElement.parent);
            const childIndex = textElement.parent.children.findIndex(x => x == textElement);
            const middleParent = textElement.parent.copyElement(textElement.parent.parent, { createNewChildId: true });
            const endParent = textElement.parent.copyElement(textElement.parent.parent, { createNewChildId: true });

            textElement.text = startText;

            if (middleParent) {


                if (middleParent.styles.length == 0) {
                    newTextElement = new TextElement(textElement.parent.parent, middleText);
                    textElement.parent.parent.children.splice(index + 1, 0, newTextElement);
                } else {
                    const spanElement = new SpanElement(textElement.parent.parent);

                    spanElement.styles = textElement.parent.styles;
                    newTextElement = new TextElement(spanElement, middleText);
                    spanElement.children.push(newTextElement);
                    textElement.parent.parent.children.splice(index + 1, 0, spanElement);
                }
            }

            if (endParent) {
                (endParent.children[childIndex] as TextElement).text = endText;
                textElement.parent.parent.children.splice(index + 2, 0, endParent);
            }

            return newTextElement;
        }




        const topParent = textElement.parent.parent;
        const startCopy = textElement.parent.copyElement(topParent, { createNewChildId: true });
        const middleCopy = textElement.parent.copyElement(topParent);
        const endCopy = textElement.parent.copyElement(topParent, { createNewChildId: true });
        const index = topParent.children.findIndex(x => x == (textElement.parent));

        if (startCopy) {
            (startCopy.firstChild as TextElement).text = startText;
            topParent.children.splice(index, 1, startCopy);
        }

        if (middleCopy) {
            newTextElement = middleCopy.firstChild as TextElement;
            newTextElement.text = middleText;
            topParent.children.splice(index + 1, 0, middleCopy);
        }

        if (endCopy) {
            (endCopy.firstChild as TextElement).text = endText;
            topParent.children.splice(index + 2, 0, endCopy);
        }

        this.text.selection.resetSelection();

        return this.removeTopStyle(newTextElement);
    }






    // ---------------------------------------------------------Remove Style At End Of Text----------------------------------------------------------
    protected removeStyleAtEndOfText(textElement: TextElement, startOffset: number): TextElement {
        const startText = textElement.text.substring(0, startOffset);
        const endText = textElement.text.substring(startOffset);
        let newTextElement!: TextElement;

        if (textElement.parent.nodeType == NodeType.A) {
            const index = textElement.parent.parent.children.findIndex(x => x == textElement.parent);
            const parentCopy = textElement.parent.copyElement(textElement.parent.parent, { createNewChildId: true });
            textElement.text = startText;

            if (parentCopy) {
                if (parentCopy.styles.length == 0) {
                    newTextElement = new TextElement(textElement.parent.parent, endText);
                    textElement.parent.parent.children.splice(index + 1, 0, newTextElement);
                } else {
                    const spanElement = new SpanElement(textElement.parent.parent);

                    spanElement.styles = textElement.parent.styles;
                    newTextElement = new TextElement(spanElement, endText);
                    spanElement.children.push(newTextElement);
                    textElement.parent.parent.children.splice(index + 1, 0, spanElement);
                }
            }

            return newTextElement;
        }



        const topParent = textElement.parent.parent;
        const startCopy = textElement.parent.copyElement(topParent, { createNewChildId: true });
        const endCopy = textElement.parent.copyElement(topParent);
        const index = topParent.children.findIndex(x => x == (textElement.parent));

        if (startCopy) {
            (startCopy.firstChild as TextElement).text = startText;
            topParent.children.splice(index, 1, startCopy);
        }

        if (endCopy) {
            newTextElement = endCopy.firstChild as TextElement;
            newTextElement.text = endText;
            topParent.children.splice(index + 1, 0, endCopy);
        }



        this.text.selection.resetSelection();
        return this.removeTopStyle(newTextElement);
    }






    // ---------------------------------------------------------Remove Style From All Of Text----------------------------------------------------------
    protected removeStyleFromAllOfText(textElement: TextElement): TextElement {
        let newTextElement!: TextElement;

        if (textElement.parent.nodeType == NodeType.A) {
            const index = textElement.parent.parent.children.findIndex(x => x == textElement.parent);

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

            return newTextElement;
        }

        return this.removeTopStyle(textElement);
    }






    // ---------------------------------------------------------Remove Top Style----------------------------------------------------------
    protected removeTopStyle(textElement: TextElement): TextElement {
        const container = textElement.container;
        let styleParent = textElement.parent;
        let curentElement = textElement as Element;


        while (styleParent.nodeType != NodeType.A) {
            curentElement = styleParent;
            styleParent = styleParent.parent;

            // If the style is not found, return
            if (styleParent.nodeType == NodeType.Div || styleParent.nodeType == NodeType.Li) return textElement;
        }

        const currentElementIndex = styleParent.children.findIndex(x => x == curentElement);
        const styleParentIndex = styleParent.parent.children.findIndex(x => x == styleParent);

        // Make a copy of the parent that has the style
        const styleParentCopy = styleParent.copyElement(styleParent.parent);

        if (styleParentCopy) {

            // This will add the style parent copy to its parent
            styleParent.parent.children.splice(styleParentIndex + 1, 0, styleParentCopy);


            // Remove any children that is before the current element
            if (currentElementIndex > 0) {
                styleParentCopy.children.splice(0, currentElementIndex);
            }



            // This will create the style for the elements that are NOT in the selection
            let currentChild = styleParentCopy.firstChild;
            while (currentChild && currentChild.isChildOf(styleParentCopy)) {
                if (!this.text.selection.isInRange(currentChild.id)) {
                    if (currentChild.parent.children.length == 1) {
                        const newElement = this.setStyleToElement(currentChild.parent);

                        currentChild = newElement.children[0] as TextElement;
                    } else {
                        const index = currentChild.parent.children.findIndex(x => x == currentChild);
                        const styleElement = this.createStyleElement(currentChild.parent);
                        const currentChildCopy = currentChild.copyElement(styleElement);


                        if (currentChildCopy) {
                            styleElement.children.push(currentChildCopy);
                            currentChild.parent.children.splice(index, 1, styleElement);
                            currentChild = currentChildCopy;
                        }
                    }
                }

                currentChild = currentChild.nextChild as TextElement;
            }


            let index = styleParentIndex + 1;

            // If there are no styles on the style parent copy, move the children outside the style parent copy
            if (styleParentCopy.styles.length == 0) {
                styleParentCopy.children.forEach((child: Element) => {
                    const childCopy = child.copyElement(styleParentCopy.parent);

                    if (childCopy) styleParentCopy.parent.children.splice(index, index == styleParentIndex + 1 ? 1 : 0, childCopy);

                    index++;
                });

                // We have styles on the style parent copy
                // so we have to create a span element to hold the styles and children from the style parent copy
            } else {
                const spanElement = new SpanElement(styleParentCopy.parent);

                spanElement.styles = styleParentCopy.styles;
                styleParentCopy.children.forEach((child: Element) => {
                    const childCopy = child.copyElement(spanElement);

                    if (childCopy) spanElement.children.push(childCopy);
                });

                spanElement.parent.children.splice(index, 1, spanElement);
            }
        }

        // Remove the children from the original style parent starting from the current element
        styleParent.children.splice(currentElementIndex, styleParent.children.length - currentElementIndex);

        // If we have no more children, delete the original style parent
        if (styleParent.children.length == 0) {
            styleParent.parent.children.splice(styleParentIndex, 1);
        }

        return Element.search(textElement.id, container) as TextElement;
    }
}