import { Text } from "./text";
import { ToggleStyle } from "./toggle-style";

export class Bold extends ToggleStyle {

    constructor(text: Text) {
        super(text);

        this.name = 'font-weight';
        this.value = 'bold';
    }
}