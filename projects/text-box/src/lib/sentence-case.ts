import { Case } from "./case";

export class SentenceCase extends Case {

    // ---------------------------------------------------------Set Case------------------------------------------------------------------
    protected setCase(text: string): string {
        return text.toLowerCase().replace(/^(?:\s*)\w|(?:[.?!\n]\s*)\w/g, x => x.toUpperCase());
    }
}