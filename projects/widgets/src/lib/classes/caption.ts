import { KeyValue } from "@angular/common";
import { ColorProperty } from "./color-property";

export class Caption extends ColorProperty {
    public fontWeight: string = 'normal';
    public fontStyle: string = 'normal';
    public textDecoration: string = 'none';
    public text!: string;

    private _fontOptions: Array<KeyValue<string, string>> = [
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
    public get fontOptions(): Array<KeyValue<string, string>> {
        return this._fontOptions;
    }
    public font: KeyValue<string, string> = this.fontOptions[0];


    private _fontSizes: Array<KeyValue<string, string>> = [
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
    public get fontSizes(): Array<KeyValue<string, string>> {
        return this._fontSizes;
    }


    public fontSize: KeyValue<string, string> = this.fontSizes[6];


    constructor() {
        super();

        Object.defineProperty(
            this,
            '_fontOptions',
            {
                enumerable: false
            }
        );


        Object.defineProperty(
            this,
            '_fontSizes',
            {
                enumerable: false
            }
        );

        Object.assign(this);
    }




    setData(caption: Caption) {
        if (caption) {
            if (caption.fontWeight) this.fontWeight = caption.fontWeight;
            if (caption.fontStyle) this.fontStyle = caption.fontStyle;
            if (caption.textDecoration) this.textDecoration = caption.textDecoration;
            if (caption.font && caption.font.key) this.font = this.fontOptions.find(x => x.key == caption.font.key)!;
            if (caption.fontSize && caption.fontSize.key) this.fontSize = this.fontSizes.find(x => x.key == caption.fontSize.key)!;
            if (caption.color) this.color = caption.color;
            if (caption.text) this.text = caption.text;
        }
    }


    getData(): Caption {
        const caption = new Caption();

        caption.fontWeight = this.fontWeight != 'normal' ? this.fontWeight : null!;
        caption.fontStyle = this.fontStyle != 'normal' ? this.fontStyle : null!;
        caption.textDecoration = this.textDecoration != 'none' ? this.textDecoration : null!;
        caption.font = this.font.key != this.fontOptions[0].key ? { key: this.font.key, value: this.font.value } : null!;
        caption.fontSize = this.fontSize.key != this.fontSizes[6].key ? { key: this.fontSize.key, value: this.fontSize.value } : null!;
        caption.color = this.color;
        caption.text = this.text;

        return caption;
    }


    public getDefaultColor(): string {
        return '#c8c8c8';
    }
}