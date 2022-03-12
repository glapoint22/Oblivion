// import { ListItem } from "./list-item";
// import { ListManager } from "./list-manager";

// export class EditableListManager extends ListManager {
//     keydown(e: KeyboardEvent) {
//         super.keydown(e);
//         if (e.key === 'Enter') this.enter(e);
//     }


//     setAddItem(listItem: ListItem) {
        // this.overButton = false;
        // this.addEventListeners();


        // this.sourceList.forEach(x => {
        //     x.selected = false;
        //     x.selectType = null!;
        // })


        // this.newItem = true;
        // this.selectedItem = null!;
        // this.unselectedItem = null!;
        // this.editableItem = listItem;

        // this.setItemFocus(this.editableItem);
        // this.onListUpdate.next({ addDisabled: true, editDisabled: true, deleteDisabled: true });
    // }




//     setEditItem(listItem: ListItem) {
//         if (listItem) {
//             this.overButton = false;
//             this.editableItem = listItem;
//             this.selectedItem = null!;

//             this.sourceList.forEach(x => {
//                 if (x.selected) x.selected = false;
//                 if (x.selectType) x.selectType = null!;
//             })
//             this.setItemFocus(this.editableItem);
//             this.onListUpdate.next({ addDisabled: true, editDisabled: true, deleteDisabled: true });
//         }
//     }



//     onItemDoubleClick(listItem: ListItem) {
//         if (!this.shiftKeyDown && !this.ctrlKeyDown) {
//             this.setEditItem(listItem);
//         }
//     }
// }