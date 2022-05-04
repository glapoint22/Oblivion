import { KeyValue } from "@angular/common";
import { Style } from "./style";

export class Font extends Style {
    public options!: Array<KeyValue<string, string>>;
    public selectedOption!: KeyValue<string, string> | null;
    protected defaultOption!: KeyValue<string, string>;


    // ---------------------------------------------------------Set Style------------------------------------------------------------------
    public setStyle(): void {
        this.value = this.selectedOption?.value!;
        super.setStyle();
    }


    // ---------------------------------------------------------Set Selected Style----------------------------------------------------------
    public setSelectedStyle(): void {
        this.value = this.getSelectedValue()!;

        // If we have a value
        if (this.value) {
            // If all selected values are the same
            if (this.styleSelected) {
                this.selectedOption = this.options.find(x => x.value == this.value)!;
                return;
            }

            // We have a mix of values
            this.selectedOption = null;
            return;
        }

        // No value is selected, assign the default
        this.selectedOption = this.defaultOption;
    }
}