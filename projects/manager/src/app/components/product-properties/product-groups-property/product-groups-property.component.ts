import { Component, Input, ViewChild } from '@angular/core';
import { ListUpdate } from '../../../classes/list-update';
import { ListItem } from '../../../classes/list-item';
import { ListUpdateType, MenuOptionType } from '../../../classes/enums';
import { ListOptions } from '../../../classes/list-options';
import { HierarchyComponent } from '../../hierarchies/hierarchy/hierarchy.component';

@Component({
  selector: 'product-groups-property',
  templateUrl: './product-groups-property.component.html',
  styleUrls: ['./product-groups-property.component.scss']
})
export class ProductGroupsPropertyComponent {
  @Input() productGroups!: Array<ListItem>;
  @ViewChild('list') list!: HierarchyComponent;
  public listOptions: ListOptions = new ListOptions();


  ngAfterViewInit() {
    this.listOptions = {
      deletePrompt: {
        parentObj: this.list,
        title: 'Delete',
        primaryButton: {
          name: 'Delete',
          buttonFunction: this.list.delete
        },
        secondaryButton: {
          name: 'Close'
        },
        tertiaryButton: {
          name: 'Trumpy'
        }
      },
      menu: {
        parentObj: this.list,
        menuOptions: [
          {
            type: MenuOptionType.MenuItem,
            name: 'Add Group',
            shortcut: 'Ctrl+A'
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Edit Group',
            shortcut: 'Ctrl+E'
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Delete Group',
            shortcut: 'Delete',
            optionFunction: this.list.delete
          }
        ]
      }
    }
  }
  

  private _listUpdate: ListUpdate = new ListUpdate();
  public get listUpdate(): ListUpdate {
    return this._listUpdate;
  }
  public set listUpdate(update: ListUpdate) {
    this._listUpdate = update;

    if (update.type == ListUpdateType.SelectedItems) {


      if(update.selectedItems!.length > 1) {
        this.listOptions.menu!.menuOptions[1].isDisabled = true;
        this.listOptions.menu!.menuOptions[2].name = 'Delete Groups';
      }else {
        this.listOptions.menu!.menuOptions[1].isDisabled = false;
        this.listOptions.menu!.menuOptions[2].name = 'Delete Group';
      }
    }
    
    

    if (update.type == ListUpdateType.Add) {
      // this.productGroups[update.index!].id = 22;
    }

    if (update.type == ListUpdateType.Edit) {
      // console.log(update)
    }

    if(update.type == ListUpdateType.DeletePrompt) {
      // console.log(update.deletedItems)


      this.listOptions.deletePrompt!.message = 'Make America Great Again';
      // this.list.openPrompt();
      // this.list.delete()
    }

    if (update.type == ListUpdateType.Delete) {
      // console.log(update.deletedItems)
    }
  }


  
}