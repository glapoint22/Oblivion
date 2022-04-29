import { Selection } from "./selection";
import { ToggleStyle } from "./toggle-style";

export class Underline extends ToggleStyle {
    constructor(selection: Selection) {
        super(selection);

        this.name = 'text-decoration';
        this.value = 'underline';
    }
}