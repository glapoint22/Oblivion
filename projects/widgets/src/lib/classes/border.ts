import { Color } from "./color";

export class Border {
    public enabled: boolean = false;
    public width: number = 1;
    public style: string = 'solid';

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
        this.color = color ? color : '#bebebe';
    }

    setData(border: Border) {
        if (border) {
            if (border.enabled) this.enabled = border.enabled;
            if (border.width) this.width = border.width;
            if (border.style) this.style = border.style;
            if (border.color) this.color = border.color;
        }
    }
}