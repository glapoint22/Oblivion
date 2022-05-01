import { Element } from "./element";
import { ElementType } from "./element-type";
import { Style } from "./style";
import { TextElement } from "./text-element";

export abstract class ToggleStyle extends Style {
    public isSelected!: boolean;


    // ---------------------------------------------------------Set Selected Style----------------------------------------------------------
    public setSelectedStyle(): void {
        this.isSelected = this.isStyleSelected;
    }



    // ---------------------------------------------------------Add Style------------------------------------------------------------------
    protected addStyle(element: Element, startOffset: number, endOffset: number): void {
        if (this.isStyleSelected) {
            this.removeStyle(element, startOffset, endOffset);
        } else {
            super.addStyle(element, startOffset, endOffset);
        }
    }



    // ---------------------------------------------------------Remove Style------------------------------------------------------------------
    protected removeStyle(element: Element, startOffset: number, endOffset: number): void {
        if (element.elementType == ElementType.Text) {
            const textElement = element as TextElement;

            if (startOffset == 0 && endOffset < textElement.text.length) {
                this.removeStyleAtBeginningOfText(textElement, endOffset);
            } else if (startOffset > 0 && endOffset < textElement.text.length) {
                this.removeStyleFromMiddleOfText(textElement, startOffset, endOffset);
            } else if (startOffset > 0 && endOffset == textElement.text.length) {
                this.removeStyleAtEndOfText(textElement, startOffset);
            } else if (startOffset == 0 && endOffset == textElement.text.length) {
                this.removeStyleFromAllOfText(textElement);
            }
        } else {
            this.removeStyleFromContainer(element);
        }
    }






    // ---------------------------------------------------------Remove Style At Beginning Of Text------------------------------------------------------------------
    protected removeStyleAtBeginningOfText(textElement: TextElement, endOffset: number): void {
        const styleIndex = textElement.parent.styles.findIndex(x => x.name == this.name);
        const startText = textElement.text.substring(0, endOffset);
        const endText = textElement.text.substring(endOffset);
        let newTextElement!: TextElement;

        if (styleIndex != -1 && textElement.parent.children.length == 1) {
            const index = textElement.parent.index;
            const parentCopy = textElement.parent.copy(textElement.parent.parent, this.selection);

            parentCopy.styles.splice(styleIndex, 1);

            if (parentCopy.styles.length == 0) {
                newTextElement = new TextElement(textElement.parent.parent, startText);
                textElement.parent.parent.children.splice(index, 0, newTextElement);
            } else {
                newTextElement = parentCopy.children[0] as TextElement;
                newTextElement.text = startText;
                textElement.parent.parent.children.splice(index, 0, parentCopy);
            }

            textElement.text = endText;
        } else {
            const topParent = styleIndex == -1 ? textElement.parent.parent : textElement.parent;
            const startCopy = styleIndex == -1 ? textElement.parent.copy(topParent, this.selection) : textElement.copy(textElement.parent, this.selection);
            const endCopy = styleIndex == -1 ? textElement.parent.copy(topParent, this.selection) : textElement.copy(textElement.parent, this.selection);
            const index = styleIndex == -1 ? textElement.parent.index : textElement.index;

            newTextElement = startCopy.firstChild as TextElement;
            newTextElement.text = startText;
            topParent.children.splice(index, 1, startCopy);

            (endCopy.firstChild as TextElement).text = endText;
            topParent.children.splice(index + 1, 0, endCopy);

            this.removeTopStyle(newTextElement);
        }


    }





    // ---------------------------------------------------------Remove Style From Middle Of Text------------------------------------------------------------------
    protected removeStyleFromMiddleOfText(textElement: TextElement, startOffset: number, endOffset: number): void {
        throw new Error("Method not implemented.");
    }





    // ---------------------------------------------------------Remove Style At End Of Text------------------------------------------------------------------
    protected removeStyleAtEndOfText(textElement: TextElement, startOffset: number): void {
        throw new Error("Method not implemented.");
    }




    // ---------------------------------------------------------Remove Style From All Of Text------------------------------------------------------------------
    protected removeStyleFromAllOfText(textElement: TextElement): void {
        throw new Error("Method not implemented.");
    }



    // ---------------------------------------------------------Remove Style From Container------------------------------------------------------------------
    protected removeStyleFromContainer(element: Element): void {
        throw new Error("Method not implemented.");
    }



    // ---------------------------------------------------------Remove Top Style----------------------------------------------------------
    protected removeTopStyle(textElement: TextElement): void {
        let styleParent = textElement.parent;
        let curentElement = textElement as Element;


        while (!styleParent.styles.some(x => x.name == this.name)) {
            curentElement = styleParent;
            styleParent = styleParent.parent;

            // If the style is not found, return
            if (styleParent.elementType == ElementType.Div || styleParent.elementType == ElementType.ListItem) return;
        }

        const currentElementIndex = curentElement.index;
        const styleParentIndex = styleParent.index;

        // Make a copy of the parent that has the style
        const styleParentCopy = styleParent.copy(styleParent.parent, this.selection);

        // Remove the style
        const styleIndex = styleParentCopy.styles.findIndex(x => x.name == this.name);
        styleParentCopy.styles.splice(styleIndex, 1);

        // This will add the style parent copy to its parent
        styleParent.parent.children.splice(styleParentIndex + 1, 0, styleParentCopy);


        // Remove any children that is before the current element
        if (currentElementIndex > 0) {
            styleParentCopy.children.splice(0, currentElementIndex);
        }



        // This will create the style for the elements that are NOT in the selection
        let currentChild = styleParentCopy.firstChild;
        while (currentChild && Element.search(currentChild.id, styleParentCopy)) {
            if (!this.selection.isInRange(currentChild.id)) {
                if (currentChild.parent.children.length == 1) {
                    this.addStyleToElement(currentChild.parent);
                } else {
                    const index = currentChild.parent.children.findIndex(x => x == currentChild);
                    const styleElement = this.createStyleElement(currentChild.parent);
                    const currentChildCopy = currentChild.copy(styleElement, this.selection);

                    this.addStyleToElement(styleElement);

                    if (currentChildCopy) {
                        styleElement.children.push(currentChildCopy);
                        currentChild.parent.children.splice(index, 1, styleElement);
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
                const childCopy = child.copy(styleParentCopy.parent, this.selection);

                if (childCopy) styleParentCopy.parent.children.splice(index, index == styleParentIndex + 1 ? 1 : 0, childCopy);

                index++;
            });
        }

        // Remove the children from the original style parent starting from the current element
        styleParent.children.splice(currentElementIndex, styleParent.children.length - currentElementIndex);

        // If we have no more children, delete the original style parent
        if (styleParent.children.length == 0) {
            styleParent.parent.children.splice(styleParentIndex, 1);
        }
    }
}