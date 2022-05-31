import { Color } from "common";
import { BackgroundImage } from "./background-image";
import { Enableable } from "./enableable";

export class Background implements Enableable {
    public image: BackgroundImage = new BackgroundImage();
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
        this._color = this._rgbColor.toHex();
        return this._rgbColor;
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



    getData(): Background {
        const background = new Background();

        background.color = this.color;
        if (this.image) background.image = this.image.getData();
        background.enabled = this.enabled;

        return background;
    }
}