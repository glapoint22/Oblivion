import { Component, Input } from '@angular/core';
import { EditableCheckboxListManager } from '../../../classes/editable-checkbox-list-manager';
import { EditableListItemComponent } from '../editable-list-item/editable-list-item.component';

@Component({
  selector: 'editable-checkbox-list-item',
  templateUrl: './editable-checkbox-list-item.component.html',
  styleUrls: ['../list-item/list-item.component.scss', '../editable-list-item/editable-list-item.component.scss', './editable-checkbox-list-item.component.scss']
})
export class EditableCheckboxListItemComponent extends EditableListItemComponent {
  @Input() listManager!: EditableCheckboxListManager;
}