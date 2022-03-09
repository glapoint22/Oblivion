import { Component, Input } from '@angular/core';
import { CheckboxListManager } from '../../../classes/checkbox-list-manager';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'checkbox-item',
  templateUrl: './checkbox-item.component.html',
  styleUrls: ['../item/item.component.scss', './checkbox-item.component.scss']
})
export class CheckboxItemComponent extends ItemComponent {
  @Input() listManager!: CheckboxListManager;
}