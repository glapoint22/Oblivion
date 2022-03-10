import { Component } from '@angular/core';
import { EditableHierarchyManager } from '../../../classes/editable-hierarchy-manager';
import { EditableListComponent } from '../editable-list/editable-list.component';

@Component({
  selector: 'editable-arrow-list',
  templateUrl: './editable-arrow-list.component.html',
  styleUrls: ['./editable-arrow-list.component.scss']
})
export class EditableArrowListComponent extends EditableListComponent {
  public listManager!: EditableHierarchyManager;

  instantiate() {
    this.listManager = new EditableHierarchyManager();
  }
}