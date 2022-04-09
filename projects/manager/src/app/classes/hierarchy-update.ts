import { HierarchyItem } from "./hierarchy-item";
import { ListUpdate } from "./list-update";

export class HierarchyUpdate extends ListUpdate{
    arrowDown?: boolean;
    hasChildren?: boolean;
    hierarchyGroupID?: number;
    deletedItems?: Array<HierarchyItem>;
    selectedItems?: Array<HierarchyItem>;
}