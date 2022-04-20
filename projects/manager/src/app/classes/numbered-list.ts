import { NodeType } from "widgets";
import { Element } from "./element";
import { ListStyle } from "./list-style";
import { OrderedListElement } from "./ordered-list-element";
import { Text } from "./text";


export class NumberedList extends ListStyle {

    constructor(text: Text) {
        super(text);

        this.listType = NodeType.Ol;
    }



    // ---------------------------------------------------------Create List Container------------------------------------------------------------------
    protected createListContainer(parent: Element): Element {
        return new OrderedListElement(parent);
    }
}