import { CheckboxItem } from "./checkbox-item";
import { HierarchyUpdate } from "./hierarchy-update";

export class CheckboxListUpdate extends HierarchyUpdate {
    checked?: boolean;
    deletedCheckboxListItems?: Array<CheckboxItem>;
    selectedCheckboxListItems?: Array<CheckboxItem>;
}