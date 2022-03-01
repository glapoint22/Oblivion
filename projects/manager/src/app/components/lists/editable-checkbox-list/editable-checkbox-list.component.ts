import { Component } from '@angular/core';
import { EditableCheckboxListManager } from '../../../classes/editable-checkbox-list-manager';
import { EditableListComponent } from '../editable-list/editable-list.component';

@Component({
  selector: 'editable-checkbox-list',
  templateUrl: './editable-checkbox-list.component.html',
  styleUrls: ['./editable-checkbox-list.component.scss']
})
export class EditableCheckboxListComponent extends EditableListComponent { 
  public listManager!: EditableCheckboxListManager;

  instantiate() {
    this.listManager = new EditableCheckboxListManager();
  }
}