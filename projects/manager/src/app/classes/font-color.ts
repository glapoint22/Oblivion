import { ColorStyle } from "./color-style";
import { Text } from "./text";

export class FontColor extends ColorStyle {

    constructor(text: Text) {
        super(text)
        this.defaultColor = this.color = '#dadada';
        this.name = 'color';
    }
}