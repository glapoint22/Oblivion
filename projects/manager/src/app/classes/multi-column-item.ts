import { ListItem } from "./list-item";
import { MultiColumnItemValue } from "./multi-column-item-value";

export class MultiColumnItem extends ListItem {
    values: Array<MultiColumnItemValue> = new Array<MultiColumnItemValue>();
}