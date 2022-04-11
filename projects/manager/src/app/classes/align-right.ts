import { Text } from "./text";
import { TextAlign } from "./text-align";

export class AlignRight extends TextAlign {
    public isSelected!: boolean;

    constructor(text: Text) {
        super(text);
        this.value = 'right';
    }
}