import { Component, Input } from '@angular/core';
import { EditableListManager } from '../../../classes/editable-list-manager';
import { ListItemComponent } from '../list-item/list-item.component';

@Component({
  selector: 'editable-list-item',
  templateUrl: './editable-list-item.component.html',
  styleUrls: ['../list-item/list-item.component.scss', '../editable-list-item/editable-list-item.component.scss']
})
export class EditableListItemComponent extends ListItemComponent {
  @Input() listManager!: EditableListManager;
 }