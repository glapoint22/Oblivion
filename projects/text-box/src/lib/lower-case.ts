import { Case } from "./case";

export class LowerCase extends Case {

    // ---------------------------------------------------------Set Case------------------------------------------------------------------
    public getCase(text: string): string {
        return text.toLowerCase();
    }
}