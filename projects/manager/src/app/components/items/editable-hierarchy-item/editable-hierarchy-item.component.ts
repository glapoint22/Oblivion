import { Component, Input } from '@angular/core';
import { EditableHierarchyManager } from '../../../classes/editable-hierarchy-manager';
import { EditableListItemComponent } from '../editable-list-item/editable-list-item.component';

@Component({
  selector: 'editable-hierarchy-item',
  templateUrl: './editable-hierarchy-item.component.html',
  styleUrls: ['../list-item/list-item.component.scss', '../editable-list-item/editable-list-item.component.scss', './editable-hierarchy-item.component.scss']
})
export class EditableHierarchyItemComponent extends EditableListItemComponent {
  @Input() listManager!: EditableHierarchyManager;
}