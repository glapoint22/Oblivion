import { Component, Input } from '@angular/core';
import { CheckboxListManager } from '../../../classes/checkbox-list-manager';
import { ListItemComponent } from '../list-item/list-item.component';

@Component({
  selector: 'checkbox-list-item',
  templateUrl: './checkbox-list-item.component.html',
  styleUrls: ['../list-item/list-item.component.scss', './checkbox-list-item.component.scss']
})
export class CheckboxListItemComponent extends ListItemComponent {
  @Input() listManager!: CheckboxListManager;
}