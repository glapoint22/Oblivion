import { Component, OnInit } from '@angular/core';
import { EditableArrowList } from '../../../classes/editable-arrow-list';
import { EditableListComponent } from '../editable-list/editable-list.component';

@Component({
  selector: 'editable-arrow-list',
  templateUrl: './editable-arrow-list.component.html',
  styleUrls: ['./editable-arrow-list.component.scss']
})
export class EditableArrowListComponent extends EditableListComponent {
  public list!: EditableArrowList;

  instantiate() {
    this.list = new EditableArrowList();
  }
}