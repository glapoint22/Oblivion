import { Component, Input } from '@angular/core';
import { EditableArrowListManager } from '../../../classes/editable-arrow-list-manager';
import { EditableItemComponent } from '../editable-item/editable-item.component';

@Component({
  selector: 'editable-arrow-item',
  templateUrl: './editable-arrow-item.component.html',
  styleUrls: ['../item/item.component.scss', '../editable-item/editable-item.component.scss', './editable-arrow-item.component.scss']
})
export class EditableArrowItemComponent extends EditableItemComponent {
  @Input() listManager!: EditableArrowListManager;
  public arrowDown!: boolean;
}