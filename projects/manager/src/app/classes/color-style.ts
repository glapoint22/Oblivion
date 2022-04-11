import { Color, StyleData } from "widgets";
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

    // ---------------------------------------------------------Set Selected Style------------------------------------------------------------------
    public setSelectedStyle(): void {

        // If we have any styles
        if (this.text.selection.selectedStyles.length > 0 && !(this.text.selection.selectedStyles.length == 1 && this.text.selection.selectedStyles[0].length == 0)) {
            let firstColorStyle!: StyleData;

            for (let i = 0; i < this.text.selection.selectedStyles.length; i++) {
                const styles = this.text.selection.selectedStyles[i];

                // Find the first color style
                const colorStyle = styles.find(x => x.style == this.name);
                if (colorStyle) {
                    firstColorStyle = colorStyle;
                    break;
                }
            }

            if (firstColorStyle) {
                // Is every style in the selected styles this color?
                if (this.text.selection.selectedStyles.every(x => x.some(z => z.style == this.name && z.value == firstColorStyle.value))) {
                    this.color = firstColorStyle.value;
                    return;
                }

                // We have multiple color styles selected
                this.color = '#00000000';
                return
            }
        }

        this.color = this.defaultColor;
    }



    // ---------------------------------------------------------Set Style------------------------------------------------------------------
    public setStyle(): void {
        this.value = this.color;
        super.setStyle();

        this.text.merge();
        this.text.render();
    }



    // ---------------------------------------------------------Initialize------------------------------------------------------------------
    public initialize(): void {
        window.getSelection()?.removeAllRanges();
    }



    // ---------------------------------------------------------On Color Picker Close------------------------------------------------------------------
    onColorPickerClose() {
        this.resetSelection();
    }
}