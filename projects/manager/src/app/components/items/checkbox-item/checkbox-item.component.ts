import { Component, Input } from '@angular/core';
import { CheckboxHierarchyItem } from '../../../classes/checkbox-hierarchy-item';
import { CheckboxHierarchyManager } from '../../../classes/checkbox-hierarchy-manager';
import { CheckboxListItem } from '../../../classes/checkbox-list-item';
import { ListItem } from '../../../classes/list-item';
import { ListItemComponent } from '../list-item/list-item.component';

@Component({
  selector: 'checkbox-item',
  templateUrl: './checkbox-item.component.html',
  styleUrls: ['../list-item/list-item.component.scss', './checkbox-item.component.scss']
})
export class CheckboxItemComponent extends ListItemComponent {
  @Input() item!: CheckboxHierarchyItem;
  @Input() listManager!: CheckboxHierarchyManager;
}