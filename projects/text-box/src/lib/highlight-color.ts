import { ColorStyle } from "./color-style";
import { Selection } from "./selection";

export class HighlightColor extends ColorStyle {

    constructor(selection: Selection) {
        super(selection)
        
        this.color =  this.defaultColor = '#00000000';
        this.name = 'background-color';
    }
}