import { Color } from "common";

export abstract class ColorProperty {
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
        this._color = this._rgbColor.toHex();
        return this._rgbColor;
    }


    constructor(color?: string) {
        this.color = color ? color : this.getDefaultColor();
    }


    public abstract getDefaultColor(): string;
}