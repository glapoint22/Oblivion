import { Element } from "./element";
import { ElementType } from "./element-type";
import { ListStyle } from "./list-style";
import { Selection } from "./selection";
import { UnorderedListElement } from "./unordered-list-element";

export class BulletedList extends ListStyle {

    constructor(selection: Selection) {
        super(selection);

        this.listType = ElementType.UnorderedList;
    }



    // ---------------------------------------------------------Create List Container------------------------------------------------------------------
    protected createListContainer(parent: Element): Element {
        return new UnorderedListElement(parent);
    }
}