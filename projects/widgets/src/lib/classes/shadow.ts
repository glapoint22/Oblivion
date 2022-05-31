import { Color } from "common";

export class Shadow {
    public enabled: boolean = false;
    public x: number = 5;
    public y: number = 5;
    public blur: number = 5;
    public size: number = 5;

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
        this.color = color ? color : '#000000bf';
    }

    setData(shadow: Shadow) {
        if (shadow) {
            if (shadow.enabled) this.enabled = shadow.enabled;
            if (shadow.x) this.x = shadow.x;
            if (shadow.y) this.y = shadow.y;
            if (shadow.blur) this.blur = shadow.blur;
            if (shadow.size) this.size = shadow.size;
            if (shadow.color) this.color = shadow.color;
        }
    }

    getData(): Shadow {
        const shadow = new Shadow();

        shadow.enabled = this.enabled;
        shadow.x = this.x;
        shadow.y = this.y;
        shadow.blur = this.blur;
        shadow.size = this.size;
        shadow.color = this.color;

        return shadow;
    }
}