import { AnchorElement } from "./anchor-element";
import { Element } from "./element";
import { ElementType } from "./element-type";
import { Link } from "./link";
import { Selection } from "./selection";
import { ToggleStyle } from "./toggle-style";

export class LinkStyle extends ToggleStyle {
    private link!: Link;

    constructor(selection: Selection) {
        super(selection);

        this.name = 'link';
    }

    // ---------------------------------------------------------Create Style Element----------------------------------------------------------
    protected createStyleElement(parent: Element): Element {
        return new AnchorElement(parent, this.link);
    }


    // ---------------------------------------------------------Add Style To Element----------------------------------------------------------
    protected addStyleToElement(element: Element): void {
        if (element.elementType == ElementType.Span) {
            const styleElement = this.createStyleElement(element.parent);
            const index = element.index;

            styleElement.styles = element.styles;
            element.children.forEach((child: Element) => {
                const copiedElement = child.copy(styleElement, this.selection);
                
                styleElement.children.push(copiedElement);
            });

            element.parent.children.splice(index, 1, styleElement);
        }
    }
}