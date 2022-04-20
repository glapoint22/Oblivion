import { NodeType } from "widgets";
import { Element } from "./element";
import { ListStyle } from "./list-style";
import { Text } from "./text";
import { UnorderedListElement } from "./unordered-list-element";


export class BulletedList extends ListStyle {

    constructor(text: Text) {
        super(text);

        this.listType = NodeType.Ul;
    }



    // ---------------------------------------------------------Create List Container------------------------------------------------------------------
    protected createListContainer(parent: Element): Element {
        return new UnorderedListElement(parent);
    }
}