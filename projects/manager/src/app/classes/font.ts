import { KeyValue } from "@angular/common";
import { Style } from "./style";
import { Text } from "./text";

export class Font extends Style {
    public options!: Array<KeyValue<string, string>>;
    public selectedOption!: KeyValue<string, string> | null;
    protected defaultOption!: KeyValue<string, string>;

    constructor(text: Text) { super(text); }


    // ---------------------------------------------------------Set Style------------------------------------------------------------------
    public setStyle(): void {
        this.value = this.selectedOption?.value as string;
        super.setStyle();

        this.text.merge();
        this.text.render();
        this.resetSelection();
    }



    // ---------------------------------------------------------Set Selected Style------------------------------------------------------------------
    public setSelectedStyle(): void {
        if (this.text.selection.selectedStyles.length > 0 && !(this.text.selection.selectedStyles.length == 1 && this.text.selection.selectedStyles[0].length == 0)) {
            for (let i = 0; i < this.options.length; i++) {
                const option = this.options[i];

                // Do some of the selected styles contain the current font option?
                if (this.text.selection.selectedStyles.some(x => x.some(z => z.style == this.name && z.value == option.value))) {

                    // Is every style in the selected styles this font option?
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
        this.selectedOption = this.defaultOption;
    }
}