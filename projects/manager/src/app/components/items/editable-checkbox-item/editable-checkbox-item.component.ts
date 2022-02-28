import { Component, Input } from '@angular/core';
import { EditableCheckboxListManager } from '../../../classes/editable-checkbox-list';
import { EditableItemComponent } from '../editable-item/editable-item.component';

@Component({
  selector: 'editable-checkbox-item',
  templateUrl: './editable-checkbox-item.component.html',
  styleUrls: ['../item/item.component.scss', '../editable-item/editable-item.component.scss', './editable-checkbox-item.component.scss']
})
export class EditableCheckboxItemComponent extends EditableItemComponent {
  @Input() listManager!: EditableCheckboxListManager;
  public isChecked!: boolean;
}