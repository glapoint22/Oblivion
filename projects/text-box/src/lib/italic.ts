import { Selection } from "./selection";
import { ToggleStyle } from "./toggle-style";

export class Italic extends ToggleStyle {

    constructor(selection: Selection) {
        super(selection);

        this.name = 'font-style';
        this.value = 'italic';
    }
}