import { Text } from "./text";
import { TextAlign } from "./text-align";

export class AlignJustify extends TextAlign {
    public isSelected!: boolean;

    constructor(text: Text) {
        super(text);
        this.value = 'justify';
    }
}