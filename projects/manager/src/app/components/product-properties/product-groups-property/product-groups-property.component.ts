import { Component, ViewChild } from '@angular/core';
import { ListUpdate, ListUpdateType } from '../../../classes/list';
import { ListItem } from '../../../classes/list-item';
import { CheckboxListComponent } from '../../lists/checkbox-list/checkbox-list.component';
import { EditableCheckboxListComponent } from '../../lists/editable-checkbox-list/editable-checkbox-list.component';
import { ListComponent } from '../../lists/list/list.component';

@Component({
  selector: 'product-groups-property',
  templateUrl: './product-groups-property.component.html',
  styleUrls: ['./product-groups-property.component.scss']
})
export class ProductGroupsPropertyComponent {
  @ViewChild('list') list!: EditableCheckboxListComponent;
  public addDisabled!: boolean;
  public editDisabled!: boolean;
  public deleteDisabled!: boolean;
  public groups: Array<ListItem> = [
    {
      id: 1,
      name: 'Group 1'
    },
    {
      id: 2,
      name: 'Group 2'
    },
    {
      id: 3,
      name: 'Group 3'
    },
    {
      id: 4,
      name: 'Group 4'
    },
    {
      id: 5,
      name: 'Group 5'
    },
    {
      id: 6,
      name: 'Group 6'
    },
    {
      id: 7,
      name: 'Group 7'
    },
    {
      id: 8,
      name: 'Group 8'
    },
    {
      id: 9,
      name: 'Group 9'
    },
    {
      id: 10,
      name: 'Group 10'
    }
  ]



  onOverButton(isOverButton: boolean) {
    this.list.overButton(isOverButton);
  }


  onAdd() {
    // Editable List
    this.list.addItem();


    // // Non-Editable List
    // this.list.addItem(22, 'Group 5a');


    // // Editable Hierarchy
    // this.list.addItem(5);


    // // Non-Editable Hierarchy
    // this.list.addItem(5, 22, 'Group 5a');
  }



  // onEdit() {
  //   this.list.editItem();
  // }



  onDelete() {
    this.list.deleteItem();
  }




  onListUpdate(listUpdate: ListUpdate) {

    // Add
    if (listUpdate.type == ListUpdateType.Add) {
      console.log("add")
      //   this.dataService.post('api/Trumpy/Bear', {
      //     name: listUpdate.name
      //   },
      //     {
      //       spinnerAction: SpinnerAction.Start
      //     }
      //   ).subscribe((id: number) => {
      //     this.groups[listUpdate.index!].id = id;
      //   });
    }



    // Edit
    if (listUpdate.type == ListUpdateType.Edit) {
      console.log("edit")
      // this.dataService.put('api/Trumpy/Bear', {
      //   name: listUpdate.name,
      //   id: listUpdate.id
      // },
      //   {
      //     spinnerAction: SpinnerAction.Start
      //   }
      // ).subscribe();
    }


    // Delete
    if (listUpdate.type == ListUpdateType.Delete) {
      console.log("delete")
      // this.dataService.delete('api/Trumpy/Bear', {
      //   deletedItems: listUpdate.deletedItems
      // },
      //   {
      //     spinnerAction: SpinnerAction.Start
      //   }
      // ).subscribe();
    }

    if (listUpdate.type == ListUpdateType.SelectedItem) {
      // console.log(listUpdate)
    }



    if(listUpdate.type == ListUpdateType.CheckboxChange) {

      console.log(listUpdate)
    }


    this.addDisabled = listUpdate.addDisabled!;
    this.editDisabled = listUpdate.editDisabled!;
    this.deleteDisabled = listUpdate.deleteDisabled!;
  }
}