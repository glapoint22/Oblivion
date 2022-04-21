import { Indent } from "./indent";
import { Text } from "./text";

export class IncreaseIndent extends Indent {

    constructor(text: Text) { 
        super(text);

        this.indentValue = 1;
     }
}