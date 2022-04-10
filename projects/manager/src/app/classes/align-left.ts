import { Element } from "./element";
import { Text } from "./text";
import { TextAlign } from "./text-align";

export class AlignLeft extends TextAlign {
    public isSelected!: boolean;

    constructor(text: Text) {
        super(text);
        this.value = 'left';
    }


    // ---------------------------------------------------------Apply Style------------------------------------------------------------------
    protected applyStyle(element: Element, startOffset: number, endOffset: number): Element {
        const index = element.container.styles.findIndex(x => x.style == this.name);

        if (index != -1) element.container.styles.splice(index, 1);
        return element;
    }


    // ---------------------------------------------------------Set Selected Style------------------------------------------------------------------
    public setSelectedStyle(): void {
        if (this.text.selection.selectedStyles.length > 0 && !(this.text.selection.selectedStyles.length == 1 && this.text.selection.selectedStyles[0].length == 0)) {
            if (this.text.selection.selectedStyles.some(x => x.some(z => z.style == this.name))) {
                this.isSelected = false;
                return;
            }
        }

        this.isSelected = true;
    }
}