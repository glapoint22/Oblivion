import { Case } from "./case";

export class LowerCase extends Case {

    // ---------------------------------------------------------Set Case------------------------------------------------------------------
    protected setCase(text: string): string {
        return text.toLowerCase();
    }
}