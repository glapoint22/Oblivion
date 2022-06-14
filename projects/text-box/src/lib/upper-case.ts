import { Case } from "./case";

export class UpperCase extends Case {

    // ---------------------------------------------------------Set Case------------------------------------------------------------------
    public getCase(text: string): string {
        return text.toUpperCase();
    }
}