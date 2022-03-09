import { Component } from '@angular/core';
import { EditableListManager } from '../../../classes/editable-list-manager';
import { ListOptions } from '../../../classes/list-options';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'editable-list',
  templateUrl: './editable-list.component.html',
  styleUrls: ['./editable-list.component.scss']
})
export class EditableListComponent extends ListComponent {
  public listManager!: EditableListManager;
  public options: ListOptions = {}

  instantiate() {
    this.listManager = new EditableListManager();
  }


  addItem() {
    this.sourceList.unshift({ id: -1, name: '' });

    window.setTimeout(() => {
      this.listManager.addItem(this.sourceList[0]);
    })
  }


  editItem() {
    this.listManager.editItem(this.listManager.selectedItem);
  }
}