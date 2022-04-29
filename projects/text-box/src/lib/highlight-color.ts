import { ColorStyle } from "./color-style";
import { Selection } from "./selection";

export class HighlightColor extends ColorStyle {

    constructor(selection: Selection) {
        super(selection)
        
        this.color =  this.defaultColor = '#ffff00';
        this.name = 'background-color';
    }
}