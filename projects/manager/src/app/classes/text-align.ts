import { StyleData } from "widgets";
import { Element } from "./element";
import { Selection } from "./selection";
import { Style } from "./style";
import { Text } from "./text";

export class TextAlign extends Style {
    public isSelected!: boolean;

    constructor(text: Text) {
        super(text);
        this.name = 'text-align';
        this.preventCollapsedStyling = false;
    }


    // ---------------------------------------------------------Set Style------------------------------------------------------------------
    public setStyle(): void {
        super.setStyle();

        this.text.render();
        this.finalizeStyle();
    }




    // ---------------------------------------------------------Apply Style------------------------------------------------------------------
    protected applyStyle(element: Element, startOffset: number, endOffset: number): Element {
        let index!: number;

        if (element.container.styles.some((style: StyleData, i: number) => {
            index = i;
            return style.style == this.name;
        })) {
            element.container.styles[index].value = this.value;
        } else {
            this.setStyleToElement(element.container);
        }


        return element;
    }


    // ---------------------------------------------------------Get Start End Selection------------------------------------------------------------------
    public getStartEndSelection(element: Element): Selection {
        return element.getStartEndSelection(this.text.selection.startOffset, this.text.selection.endOffset);
    }



    // ---------------------------------------------------------Get Start Selection------------------------------------------------------------------
    public getStartSelection(element: Element): Selection {
        return element.getStartSelection(this.text.selection.startOffset);
    }



    // ---------------------------------------------------------Get Start Selection------------------------------------------------------------------
    public getEndSelection(element: Element): Selection {
        return element.getEndSelection(this.text.selection.endOffset);
    }



    // ---------------------------------------------------------Set Selected Style------------------------------------------------------------------
    public setSelectedStyle(): void {
        this.isSelected = this.selectionHasStyle();
    }
}