import { KeyValue } from "@angular/common";
import { Style } from "./style";

export class Font extends Style {
    
    public options!: Array<KeyValue<string, string>>;
    public selectedOption!: KeyValue<string, string>;
    protected defaultOption!: KeyValue<string, string>;


    // ---------------------------------------------------------Set Style------------------------------------------------------------------
    public setStyle(): void {
        this.value = this.selectedOption.value;
        super.setStyle();
    }


    // ---------------------------------------------------------Set Selected Style----------------------------------------------------------
    public setSelectedStyle(): void {
        // throw new Error("Method not implemented.");
    }
}