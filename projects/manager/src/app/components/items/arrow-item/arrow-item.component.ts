import { Component, Input } from '@angular/core';
import { ArrowListManager } from '../../../classes/arrow-list-manager';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'arrow-item',
  templateUrl: './arrow-item.component.html',
  styleUrls: ['../item/item.component.scss', '../editable-item/editable-item.component.scss', './arrow-item.component.scss']
})
export class ArrowItemComponent extends ItemComponent {
  @Input() listManager!: ArrowListManager;
  public arrowDown!: boolean;
}