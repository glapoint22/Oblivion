import { BackgroundImage } from "./background-image";
import { Color } from "./color";
import { Enableable } from "./enableable";

export class Background implements Enableable {
    public image!: BackgroundImage;
    public enabled!: boolean;


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
        this.color = color ? color : '#ffffff';
    }

    setData(background: Background) {
        if (background) {
            if (background.color) this.color = background.color;
            if (background.image) this.image = background.image;
            if (background.enabled) this.enabled = background.enabled;
        }
    }
}