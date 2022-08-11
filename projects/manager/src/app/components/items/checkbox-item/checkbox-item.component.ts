import { Component, Input } from '@angular/core';
import { CheckboxItem } from '../../../classes/checkbox-item';
import { ListItemComponent } from '../list-item/list-item.component';
import { CheckboxListManager } from '../../../classes/checkbox-list-manager';

@Component({
  selector: 'checkbox-item',
  templateUrl: './checkbox-item.component.html',
  styleUrls: ['../list-item/list-item.component.scss', './checkbox-item.component.scss']
})
export class CheckboxItemComponent extends ListItemComponent {
  @Input() item!: CheckboxItem;
  @Input() listManager!: CheckboxListManager;
}