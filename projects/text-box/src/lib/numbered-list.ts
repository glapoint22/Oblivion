import { Element } from "./element";
import { ElementType } from "./element-type";
import { ListStyle } from "./list-style";
import { OrderedListElement } from "./ordered-list-element";
import { Selection } from "./selection";

export class NumberedList extends ListStyle {

    constructor(selection: Selection) {
        super(selection);

        this.listType = ElementType.OrderedList;
    }



    // ---------------------------------------------------------Create List Container------------------------------------------------------------------
    protected createListContainer(parent: Element): Element {
        return new OrderedListElement(parent);
    }
}