import { Component } from '@angular/core';
import { EditableList } from '../../../classes/editable-list';
import { ListOptions } from '../../../classes/list-options';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'editable-list',
  templateUrl: './editable-list.component.html',
  styleUrls: ['./editable-list.component.scss']
})
export class EditableListComponent extends ListComponent {
  public list!: EditableList;
  public options: ListOptions = {}

  instantiate() {
    this.list = new EditableList();
  }


  addItem() {
    this.sourceList.unshift({ id: 0, name: '' });

    window.setTimeout(() => {
      this.list.addItem(this.items.find(x => x.name == '')!);
    })
  }


  editItem() {
    this.list.editItem();
  }
}