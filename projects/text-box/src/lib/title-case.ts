import { Case } from "./case";

export class TitleCase extends Case {

    // ---------------------------------------------------------Set Case------------------------------------------------------------------
    public getCase(text: string): string {
        return text.toLowerCase().replace(/^\b\w|\n\w|\b(?!a\s|a\b|an\s|an\b|the\s|the\b|and\s|and\b|as\s|as\b|at\s|at\b|but\s|but\b|by\s|by\b|even\s|even\b|for\s|for\b|from\s|from\b|if\s|if\b|in\s|in\b|into\s|into\b|like\s|like\b|near\s|near\b|nor\s|nor\b|of\s|of\b|off\s|off\b|on\s|on\b|once\s|once\b|onto\s|onto\b|or\s|or\b|out\s|out\b|over\s|over\b|past\s|past\b|so\s|so\b|than\s|than\b|that\s|that\b|till\s|till\b|to\s|to\b|up\s|up\b|upon\s|upon\b|with\s|with\b|when\s|when\b|yet\s|yet\b)\w/g, x => x.toUpperCase());
    }
}