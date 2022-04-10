import { ColorStyle } from "./color-style";
import { Text } from "./text";

export class HighlightColor extends ColorStyle {

    constructor(text: Text) {
        super(text)
        this.color =  this.defaultColor = '#00000000';
        this.name = 'background-color';
    }


    // ---------------------------------------------------------Initialize------------------------------------------------------------------
    public initialize(): void {
        super.initialize();

        this.color = '#ffff00';
    }
}