import { Component } from '@angular/core';
import { EditableCheckboxList } from '../../../classes/editable-checkbox-list';
import { EditableListComponent } from '../editable-list/editable-list.component';

@Component({
  selector: 'editable-checkbox-list',
  templateUrl: './editable-checkbox-list.component.html',
  styleUrls: ['./editable-checkbox-list.component.scss']
})
export class EditableCheckboxListComponent extends EditableListComponent { 
  public list!: EditableCheckboxList;

  instantiate() {
    this.list = new EditableCheckboxList();
  }
}