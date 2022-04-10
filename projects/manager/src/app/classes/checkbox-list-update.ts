import { CheckboxListItem } from "./checkbox-list-item";
import { ListUpdate } from "./list-update";

export class CheckboxListUpdate extends ListUpdate {
    isChecked?: boolean;
    deletedCheckboxListItems?: Array<CheckboxListItem>;
    selectedCheckboxListItems?: Array<CheckboxListItem>;
}