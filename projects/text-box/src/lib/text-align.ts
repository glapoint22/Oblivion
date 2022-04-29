import { Element } from "./element";
import { Selection } from "./selection";
import { Style } from "./style";
import { StyleData } from "./style-data";

export class TextAlign extends Style {
    public isSelected!: boolean;

    constructor(selection: Selection) {
        super(selection);

        this.name = 'text-align';
    }


    // ---------------------------------------------------------Add Style------------------------------------------------------------------
    protected addStyle(element: Element): void {
        let index!: number;

        if (element.container.styles.some((style: StyleData, i: number) => {
            index = i;
            return style.name == this.name;
        })) {
            element.container.styles[index].value = this.value;
        } else {
            this.addStyleToElement(element.container);
        }
    }
}