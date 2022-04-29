import { Case } from "./case";

export class UpperCase extends Case {

    // ---------------------------------------------------------Set Case------------------------------------------------------------------
    protected setCase(text: string): string {
        return text.toUpperCase();
    }
}