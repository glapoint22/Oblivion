import { Color } from "./color";

export class Caption {
    public fontWeight: string = 'normal';
    public fontStyle: string = 'normal';
    public textDecoration: string = 'none';
    public font: string = 'Arial, Helvetica, sans-serif';
    public fontSize: string = '14';
    public text!: string;



    private _color!: string;
    public get color(): string {
        return this._color;
    }
    public set color(v: string) {
        this._rgbColor = Color.hexToRGB(v);
        this._color = v;
    }



    private _rgbColor!: Color;
    public get rgbColor(): Color {
        return this._rgbColor;
    }
    public set rgbColor(v: Color) {
        this._color = v.toRGBString();
        this._rgbColor = v;
    }


    constructor(color?: string) {
        this.color = color ? color : '#c8c8c8';
    }


    setData(caption: Caption) {
        if (caption) {
            if (caption.fontWeight) this.fontWeight = caption.fontWeight;
            if (caption.fontStyle) this.fontStyle = caption.fontStyle;
            if (caption.textDecoration) this.textDecoration = caption.textDecoration;
            if (caption.font) this.font = caption.font;
            if (caption.fontSize) this.fontSize = caption.fontSize;
            if (caption.color) this.color = caption.color;
            if (caption.text) this.text = caption.text;
        }
    }
}