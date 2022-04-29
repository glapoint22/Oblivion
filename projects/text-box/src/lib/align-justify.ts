import { Selection } from "./selection";
import { TextAlign } from "./text-align";

export class AlignJustify extends TextAlign {

    constructor(selection: Selection) {
        super(selection);
        this.value = 'justify';
    }
}