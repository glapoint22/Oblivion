import { Color } from "common";

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
        this._color = this._rgbColor.toHex();
        return this._rgbColor;
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


    getData(): Border {
        const border = new Border();

        border.enabled = this.enabled;
        border.width = this.width;
        border.style = this.style;
        border.color = this.color;

        return border;
    }
}