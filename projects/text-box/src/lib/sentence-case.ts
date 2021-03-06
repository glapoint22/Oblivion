import { Case } from "./case";

export class SentenceCase extends Case {

    // ---------------------------------------------------------Set Case------------------------------------------------------------------
    public getCase(text: string): string {
        return text.toLowerCase().replace(/^(?:\s*)\w|(?:[.?!\n]\s*)\w/g, x => x.toUpperCase());
    }
}