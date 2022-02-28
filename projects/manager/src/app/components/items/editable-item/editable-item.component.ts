import { Component, Input } from '@angular/core';
import { EditableList } from '../../../classes/editable-list';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'editable-item',
  templateUrl: './editable-item.component.html',
  styleUrls: ['../item/item.component.scss', './editable-item.component.scss']
})
export class EditableItemComponent extends ItemComponent {
  @Input() list!: EditableList;
 }