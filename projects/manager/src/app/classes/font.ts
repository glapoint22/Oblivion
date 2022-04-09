import { KeyValue } from "@angular/common";
import { Style } from "./style";
import { Text } from "./text";

export class Font extends Style {
    public options: Array<KeyValue<string, string>>;
    public selectedOption!: KeyValue<string, string> | null;

    constructor(text: Text) {
        super(text);

        this.name = 'font-family';
        this.options = [
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

        this.selectedOption = this.options[0];
    }


    // ---------------------------------------------------------Set Style------------------------------------------------------------------
    public setStyle(): void {
        this.value = this.selectedOption?.value as string;
        super.setStyle();
    }



    // ---------------------------------------------------------Set Selected Style------------------------------------------------------------------
    public setSelectedStyle(): void {
        if (this.text.selection.selectedStyles.length > 0) {
            for (let i = 0; i < this.options.length; i++) {
                const option = this.options[i];

                // Do some of the selected styles contain the current font option
                if (this.text.selection.selectedStyles.some(x => x.some(z => z.style == this.name && z.value == option.value))) {
                    
                    // Is every style in the selected styles this font option
                    if (this.text.selection.selectedStyles.every(x => x.some(z => z.style == this.name && z.value == option.value))) {
                        
                        // Every style is this font option
                        this.selectedOption = option;
                        return;
                    }

                    // We have an array of different styles
                    this.selectedOption = null;
                    return;
                }
            }
        }

        // We have no styles so assign the default
        this.selectedOption = this.options[0];
    }
}