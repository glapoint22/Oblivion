import { Text } from "./text";
import { ToggleStyle } from "./toggle-style";

export class Italic extends ToggleStyle {

    constructor(text: Text) {
        super(text);

        this.name = 'font-style';
        this.value = 'italic';
    }
}