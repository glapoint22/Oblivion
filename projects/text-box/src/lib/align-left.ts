import { Element } from "./element";
import { Selection } from "./selection";
import { TextAlign } from "./text-align";

export class AlignLeft extends TextAlign {

    constructor(selection: Selection) {
        super(selection);
        this.value = 'left';
    }


    // ---------------------------------------------------------Add Style------------------------------------------------------------------
    protected addStyle(element: Element): Element {
        const index = element.container.styles.findIndex(x => x.name == this.name);

        if (index != -1) element.container.styles.splice(index, 1);

        return element;
    }
}