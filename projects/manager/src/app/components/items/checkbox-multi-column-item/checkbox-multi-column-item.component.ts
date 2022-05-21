import { Component, Input } from '@angular/core';
import { CheckboxMultiColumnItem } from '../../../classes/checkbox-multi-column-item';
import { CheckboxMultiColumnListManager } from '../../../classes/checkbox-multi-column-list-manager';
import { MultiColumnItemComponent } from '../multi-column-item/multi-column-item.component';

@Component({
  selector: 'checkbox-multi-column-item',
  templateUrl: './checkbox-multi-column-item.component.html',
  styleUrls: ['../list-item/list-item.component.scss', '../multi-column-item/multi-column-item.component.scss', './checkbox-multi-column-item.component.scss']
})
export class CheckboxMultiColumnItemComponent extends MultiColumnItemComponent {
  @Input() item!: CheckboxMultiColumnItem;
  @Input() listManager!: CheckboxMultiColumnListManager;
  @Input() parentSearchType!: string;

  setWidth(width: string) {
    let newWidth = parseInt(width.slice(0, 3));
    return newWidth - 23 + 'px';
  }
}