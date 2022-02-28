import { Component } from '@angular/core';
import { EditableArrowListManager } from '../../../classes/editable-arrow-list';
import { EditableListComponent } from '../editable-list/editable-list.component';

@Component({
  selector: 'editable-arrow-list',
  templateUrl: './editable-arrow-list.component.html',
  styleUrls: ['./editable-arrow-list.component.scss']
})
export class EditableArrowListComponent extends EditableListComponent {
  public listManager!: EditableArrowListManager;

  instantiate() {
    this.listManager = new EditableArrowListManager();
  }
}