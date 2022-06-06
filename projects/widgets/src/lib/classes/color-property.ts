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

        Object.defineProperty(
            this,
            '_color',
            {
                enumerable: false
            }
        );

        Object.defineProperty(
            this,
            '_rgbColor',
            {
                enumerable: false
            }
        );


        Object.defineProperty(
            this,
            'color',
            {
                enumerable: true,
                get() {
                    return this._color;
                },

                set(v) {
                    this._rgbColor = Color.hexToRGB(v);
                    this._color = v;
                }
            }
        );

        Object.assign(this);
    }


    public abstract getDefaultColor(): string;
}