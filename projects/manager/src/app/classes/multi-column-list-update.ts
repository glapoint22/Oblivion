import { ListUpdate } from "./list-update";
import { MultiColumnItemValue } from "./multi-column-item-value";

export class MultiColumnListUpdate extends ListUpdate {
    values?: Array<MultiColumnItemValue>;
}