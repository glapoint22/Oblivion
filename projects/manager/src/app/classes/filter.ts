import { CheckboxHierarchyItem } from "./checkbox-hierarchy-item";
import { FilterOption } from "./filter-option";

export class Filter extends CheckboxHierarchyItem {
    filterOptions?: Array<FilterOption> = new Array<FilterOption>();
}