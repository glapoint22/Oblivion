import { ColorStyle } from "./color-style";
import { Selection } from "./selection";

export class FontColor extends ColorStyle {

    constructor(selection: Selection) {
        super(selection)

        this.defaultColor = this.color = '#dadada';
        this.name = 'color';
    }
}