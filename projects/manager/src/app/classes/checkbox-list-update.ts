import { CheckboxItem } from "./checkbox-item";
import { HierarchyUpdate } from "./hierarchy-update";

export class CheckboxListUpdate extends HierarchyUpdate {
    isChecked?: boolean;
    deletedCheckboxListItems?: Array<CheckboxItem>;
    selectedCheckboxListItems?: Array<CheckboxItem>;
}