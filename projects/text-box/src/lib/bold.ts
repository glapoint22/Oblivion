import { Selection } from "./selection";
import { ToggleStyle } from "./toggle-style";

export class Bold extends ToggleStyle {
    constructor(selection: Selection) {
        super(selection);

        this.name = 'font-weight';
        this.value = 'bold';
    }
}