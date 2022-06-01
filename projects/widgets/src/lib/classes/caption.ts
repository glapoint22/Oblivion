import { KeyValue } from "@angular/common";
import { Color } from "common";

export class Caption {
    public fontWeight: string = 'normal';
    public fontStyle: string = 'normal';
    public textDecoration: string = 'none';
    public text!: string;
    public fontOptions: Array<KeyValue<string, string>> = [
        {
            key: 'Arial',
            value: 'Arial, Helvetica, sans-serif'
        },
        {
            key: 'Arial Black',
            value: '"Arial Black", Gadget, sans-serif'
        },
        {
            key: 'Book Antiqua',
            value: '"Book Antiqua", "Palatino Linotype", Palatino, serif'
        },
        {
            key: 'Comic Sans MS',
            value: '"Comic Sans MS", cursive, sans-serif'
        },
        {
            key: 'Courier New',
            value: '"Courier New", Courier, monospace'
        },
        {
            key: 'Georgia',
            value: 'Georgia, serif'
        },
        {
            key: 'Impact',
            value: 'Impact, Charcoal, sans-serif'
        },
        {
            key: 'Lucida Console',
            value: '"Lucida Console", Monaco, monospace'
        },
        {
            key: 'Lucida Sans Unicode',
            value: '"Lucida Sans Unicode", "Lucida Grande", sans-serif'
        },
        {
            key: 'Palatino Linotype',
            value: '"Palatino Linotype", "Book Antiqua", Palatino, serif'
        },
        {
            key: 'Tahoma',
            value: 'Tahoma, Geneva, sans-serif'
        },
        {
            key: 'Times New Roman',
            value: '"Times New Roman", Times, serif'
        },
        {
            key: 'Trebuchet MS',
            value: '"Trebuchet MS", Helvetica, sans-serif'
        },
        {
            key: 'Verdana',
            value: 'Verdana, Geneva, sans-serif'
        }
    ]

    public font: KeyValue<string, string> = this.fontOptions[0];


    public fontSizes: Array<KeyValue<string, string>> = [
        {
            key: '6',
            value: '6px'
        },
        {
            key: '8',
            value: '8px'
        },
        {
            key: '9',
            value: '9px'
        },
        {
            key: '10',
            value: '10px'
        },
        {
            key: '11',
            value: '11px'
        },
        {
            key: '12',
            value: '12px'
        },
        {
            key: '14',
            value: '14px'
        },
        {
            key: '18',
            value: '18px'
        },
        {
            key: '24',
            value: '24px'
        },
        {
            key: '30',
            value: '30px'
        },
        {
            key: '36',
            value: '36px'
        },
        {
            key: '48',
            value: '48px'
        },
        {
            key: '60',
            value: '60px'
        },
        {
            key: '72',
            value: '72px'
        },
    ]

    public fontSize: KeyValue<string, string> = this.fontSizes[6];


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
        this.color = color ? color : '#c8c8c8';
    }


    setData(caption: Caption) {
        if (caption) {
            if (caption.fontWeight) this.fontWeight = caption.fontWeight;
            if (caption.fontStyle) this.fontStyle = caption.fontStyle;
            if (caption.textDecoration) this.textDecoration = caption.textDecoration;
            if (caption.font) this.font = caption.font;
            if (caption.fontSize) this.fontSize = caption.fontSize;
            if (caption.color) this.color = caption.color;
            if (caption.text) this.text = caption.text;
        }
    }


    getData(): Caption {
        const caption = new Caption();

        caption.fontWeight = this.fontWeight;
        caption.fontStyle = this.fontStyle;
        caption.textDecoration = this.textDecoration;
        caption.font = { key: this.font.key, value: this.font.value };
        caption.fontSize = { key: this.fontSize.key, value: this.fontSize.value };
        caption.color = this.color;
        caption.text = this.text;

        return caption;
    }
}