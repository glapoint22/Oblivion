import { NodeType } from "widgets";
import { BreakElement } from "./break-element";
import { Element } from "./element";
import { SpanElement } from "./span-element";
import { Style } from "./style";
import { TextElement } from "./text-element";

export class ToggleStyle extends Style {
    public isSelected!: boolean;
    private isRemoveStyle!: boolean;


    // ---------------------------------------------------------Set Style------------------------------------------------------------------
    public setStyle(): void {
        this.isRemoveStyle = this.selectionHasStyle;

        super.setStyle();

        this.text.merge();
        this.text.render();
        this.resetSelection();
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
            newElement = this.removeStyleFromDivElement(element);
        }

        return newElement;
    }




    // ---------------------------------------------------------Remove Style At Beginning Of Text----------------------------------------------------------
    private removeStyleAtBeginningOfText(textElement: TextElement, endOffset: number): TextElement {
        const styleIndex = textElement.parent.styles.findIndex(x => x.style == this.name);
        const startText = textElement.text.substring(0, endOffset);
        const endText = textElement.text.substring(endOffset);
        let newTextElement!: TextElement;

        if (styleIndex != -1 && textElement.parent.children.length == 1) {
            const index = textElement.parent.parent.children.findIndex(x => x == textElement.parent);
            const parentCopy = textElement.parent.copyElement(textElement.parent.parent, undefined, false);

            if (parentCopy) {
                parentCopy.styles.splice(styleIndex, 1);

                if (parentCopy.styles.length == 0) {
                    newTextElement = new TextElement(textElement.parent.parent, startText);
                    textElement.parent.parent.children.splice(index, 0, newTextElement);
                } else {
                    newTextElement = parentCopy.children[0] as TextElement;
                    newTextElement.text = startText;
                    textElement.parent.parent.children.splice(index, 0, parentCopy);
                }
            }

            textElement.text = endText;

            return newTextElement;
        }

        const topParent = styleIndex == -1 ? textElement.parent.parent : textElement.parent;
        const startCopy = styleIndex == -1 ? textElement.parent.copyElement(topParent) : textElement.copyElement(textElement.parent);
        const endCopy = styleIndex == -1 ? textElement.parent.copyElement(topParent, undefined, false) : textElement.copyElement(textElement.parent, undefined, false);
        const index = topParent.children.findIndex(x => x == (styleIndex == -1 ? textElement.parent : textElement));

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
    private removeStyleAtMiddleOfText(textElement: TextElement, startOffset: number, endOffset: number): TextElement {
        const styleIndex = textElement.parent.styles.findIndex(x => x.style == this.name);
        const startText = textElement.text.substring(0, startOffset);
        const middleText = textElement.text.substring(startOffset, endOffset);
        const endText = textElement.text.substring(endOffset);
        let newTextElement!: TextElement;


        if (styleIndex != -1 && textElement.parent.children.length == 1) {
            const index = textElement.parent.parent.children.findIndex(x => x == textElement.parent);
            const childIndex = textElement.parent.children.findIndex(x => x == textElement);
            const middleParent = textElement.parent.copyElement(textElement.parent.parent, undefined, false);
            const endParent = textElement.parent.copyElement(textElement.parent.parent, undefined, false);

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




        const topParent = styleIndex == -1 ? textElement.parent.parent : textElement.parent;
        const startCopy = styleIndex == -1 ? textElement.parent.copyElement(topParent, undefined, false) : textElement.copyElement(textElement.parent, undefined, false);
        const middleCopy = styleIndex == -1 ? textElement.parent.copyElement(topParent) : textElement.copyElement(textElement.parent);
        const endCopy = styleIndex == -1 ? textElement.parent.copyElement(topParent, undefined, false) : textElement.copyElement(textElement.parent, undefined, false);
        const index = topParent.children.findIndex(x => x == (styleIndex == -1 ? textElement.parent : textElement));

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
    private removeStyleAtEndOfText(textElement: TextElement, startOffset: number): TextElement {
        const styleIndex = textElement.parent.styles.findIndex(x => x.style == this.name);
        const startText = textElement.text.substring(0, startOffset);
        const endText = textElement.text.substring(startOffset);
        let newTextElement!: TextElement;

        if (styleIndex != -1 && textElement.parent.children.length == 1) {
            const index = textElement.parent.parent.children.findIndex(x => x == textElement.parent);
            const parentCopy = textElement.parent.copyElement(textElement.parent.parent, undefined, false);
            const childIndex = textElement.parent.children.findIndex(x => x == textElement);
            textElement.text = startText;

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



        const topParent = styleIndex == -1 ? textElement.parent.parent : textElement.parent;
        const startCopy = styleIndex == -1 ? textElement.parent.copyElement(topParent, undefined, false) : textElement.copyElement(textElement.parent, undefined, false);
        const endCopy = styleIndex == -1 ? textElement.parent.copyElement(topParent) : textElement.copyElement(textElement.parent);
        const index = topParent.children.findIndex(x => x == (styleIndex == -1 ? textElement.parent : textElement));

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
    private removeStyleFromAllOfText(textElement: TextElement): TextElement {
        const styleIndex = textElement.parent.styles.findIndex(x => x.style == this.name);

        if (styleIndex != -1 && textElement.parent.children.length == 1) {
            textElement.parent.styles.splice(styleIndex, 1);

            if (textElement.parent.styles.length == 0) {
                const index = textElement.parent.parent.children.findIndex(x => x == textElement.parent);
                const newText = new TextElement(textElement.parent.parent, textElement.text);

                textElement.parent.parent.children.splice(index, 1, newText);

                return newText;
            }

            return textElement;
        }

        return this.removeTopStyle(textElement);
    }




    // ---------------------------------------------------------Remove Top Style----------------------------------------------------------
    private removeTopStyle(textElement: TextElement): TextElement {
        const container = textElement.container;
        let styleParent = textElement.parent;
        let curentElement = textElement as Element;


        while (!styleParent.styles.some(x => x.style == this.name)) {
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
            // Remove the style
            const styleIndex = styleParentCopy.styles.findIndex(x => x.style == this.name);
            styleParentCopy.styles.splice(styleIndex, 1);

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
                        currentChild.parent.styles.push(this.createStyleData())
                    } else {
                        const index = currentChild.parent.children.findIndex(x => x == currentChild);
                        const spanElement = new SpanElement(currentChild.parent);
                        const currentChildCopy = currentChild.copyElement(spanElement);

                        spanElement.styles.push(this.createStyleData());

                        if (currentChildCopy) {
                            spanElement.children.push(currentChildCopy);
                            currentChild.parent.children.splice(index, 1, spanElement);
                            currentChild = currentChildCopy;
                        }
                    }
                }

                currentChild = currentChild.nextChild as TextElement;
            }

            // If the style parent copy has no more styles
            if (styleParentCopy.styles.length == 0) {
                let index = styleParentIndex + 1;

                // Move the children outside the style parent copy
                styleParentCopy.children.forEach((child: Element) => {
                    const childCopy = child.copyElement(styleParentCopy.parent);

                    if (childCopy) styleParentCopy.parent.children.splice(index, index == styleParentIndex + 1 ? 1 : 0, childCopy);

                    index++;
                });
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




    // ---------------------------------------------------------Remove Style From Break Element----------------------------------------------------------
    private removeStyleFromDivElement(element: Element): Element {
        const child = element.firstChild;

        const styleIndex = child.parent.styles.findIndex(x => x.style == this.name);

        child.parent.styles.splice(styleIndex, 1);

        if (child.parent.styles.length == 0) {
            const newBreakElement = new BreakElement(child.parent.parent);

            child.parent.parent.children.splice(0, 1, newBreakElement);
            return newBreakElement;
        }

        return element;
    }




    // ---------------------------------------------------------Set Selected Style------------------------------------------------------------------
    public setSelectedStyle(): void {
        this.isSelected = this.selectionHasStyle;
    }
}