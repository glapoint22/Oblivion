import { Component, Input } from '@angular/core';
import { HierarchyItem } from '../../../classes/hierarchy-item';
import { HierarchyManager } from '../../../classes/hierarchy-manager';
import { ListItemComponent } from '../list-item/list-item.component';

@Component({
  selector: 'hierarchy-item',
  templateUrl: './hierarchy-item.component.html',
  styleUrls: ['../list-item/list-item.component.scss', './hierarchy-item.component.scss']
})
export class HierarchyItemComponent extends ListItemComponent {
  @Input() item!: HierarchyItem;
  @Input() listManager!: HierarchyManager;
}