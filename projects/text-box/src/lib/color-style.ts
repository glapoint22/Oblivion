import { Color } from "common";
import { Style } from "./style";

export class ColorStyle extends Style {
    public defaultColor!: string;
    private colorPickerOpen!: boolean;

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

    public set rgbColor(v: Color) {
        this._color = v.toRGBString();
        this._rgbColor = v;
    }





    // ---------------------------------------------------------Set Style------------------------------------------------------------------
    public setStyle(): void {
        this.colorPickerOpen = true;
        this.value = this.color;
        super.setStyle();
    }



    // ---------------------------------------------------------Set Selected Style----------------------------------------------------------
    public setSelectedStyle(): void {
        if (this.colorPickerOpen) return;

        this.value = this.getSelectedValue()!;

        // If we have a value
        if (this.value) {
            // If all selected values are the same
            if (this.styleSelected) {
                this.color = this.value;
                return;
            }

            // We have a mix of values
            this.color = '#00000000';
            return;
        }

        // No value is selected, assign the default
        this.color = this.defaultColor;
    }



    // ---------------------------------------------------------On Color Picker Close------------------------------------------------------------------
    onColorPickerClose() {
        this.colorPickerOpen = false;
    }
}