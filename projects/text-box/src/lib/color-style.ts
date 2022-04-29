import { Color } from "common";
import { Style } from "./style";

export class ColorStyle extends Style {
    public defaultColor!: string;

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
        this._color = this._rgbColor.toRGBString();
        return this._rgbColor;
    }

    public set rgbColor(v: Color) {
        this._color = v.toRGBString();
        this._rgbColor = v;
    }

    



    // ---------------------------------------------------------Set Style------------------------------------------------------------------
    public setStyle(): void {
        this.value = this.color;
        super.setStyle();
    }
}