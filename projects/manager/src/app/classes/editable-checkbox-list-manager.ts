// import { CheckboxListItemComponent } from "../components/items/checkbox-list-item/checkbox-list-item.component";
// import { CheckboxListItem } from "./checkbox-list-item";
// import { EditableListManager } from "./editable-list-manager";
// import { ListUpdateType } from "./enums";

// export class EditableCheckboxListManager extends EditableListManager {

//     getItem(item: CheckboxListItemComponent): CheckboxListItem {
//         const listItem: CheckboxListItem = this.sourceList.find(x => x.id == item.id) as CheckboxListItem;
//         return listItem;
//     }

//     onCheckboxChange(listItem: CheckboxListItem) {
//         listItem.isChecked = !listItem.isChecked;
//         this.onListUpdate.next({ type: ListUpdateType.CheckboxChange, id: listItem.id, index: this.sourceList.indexOf(listItem), name: listItem.name, isChecked: listItem.isChecked, addDisabled: this.addDisabled, editDisabled: this.editDisabled, deleteDisabled: this.deleteDisabled });
//     }
// }