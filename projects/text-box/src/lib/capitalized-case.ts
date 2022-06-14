import { Case } from "./case";

export class CapitalizedCase extends Case {

    // ---------------------------------------------------------Set Case------------------------------------------------------------------
    public getCase(text: string): string {
        return text.toLowerCase().replace(/\b\w/g, x => x.toUpperCase());
    }
}