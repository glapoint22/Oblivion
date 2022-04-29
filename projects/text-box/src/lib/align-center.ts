import { Selection } from "./selection";
import { TextAlign } from "./text-align";

export class AlignCenter extends TextAlign {

    constructor(selection: Selection) {
        super(selection);
        this.value = 'center';
    }
}