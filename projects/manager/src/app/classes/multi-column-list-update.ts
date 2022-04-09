import { ItemsUpdate } from "./items-update";
import { MultiColumnItem } from "./multi-column-item";
import { MultiColumnItemValue } from "./multi-column-item-value";

export class MultiColumnListUpdate extends ItemsUpdate {
    deletedMultiColumnItems?: Array<MultiColumnItem>;
    selectedMultiColumnItems?: Array<MultiColumnItem>;
    values?: Array<MultiColumnItemValue>;
}