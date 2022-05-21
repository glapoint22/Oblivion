import { CheckboxItem } from "./checkbox-item";
import { FilterOption } from "./filter-option";

export class Filter extends CheckboxItem {
    filterOptions?: Array<FilterOption> = new Array<FilterOption>();
}