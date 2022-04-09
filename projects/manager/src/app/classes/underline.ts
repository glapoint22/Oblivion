import { Text } from "./text";
import { ToggleStyle } from "./toggle-style";

export class Underline extends ToggleStyle {

    constructor(text: Text) {
        super(text);

        this.name = 'text-decoration';
        this.value = 'underline';
    }
}