import { Component } from '@angular/core';
import { EditableListManager } from '../../../classes/editable-list';
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
    this.sourceList.unshift({ id: 0, name: '' });

    window.setTimeout(() => {
      this.listManager.addItem(this.items.find(x => x.name == '')!);
    })
  }


  editItem() {
    this.listManager.editItem();
  }
}