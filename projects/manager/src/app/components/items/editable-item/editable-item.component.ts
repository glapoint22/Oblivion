import { Component, Input } from '@angular/core';
import { EditableListManager } from '../../../classes/editable-list-manager';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'editable-item',
  templateUrl: './editable-item.component.html',
  styleUrls: ['../item/item.component.scss', './editable-item.component.scss']
})
export class EditableItemComponent extends ItemComponent {
  @Input() listManager!: EditableListManager;
 }