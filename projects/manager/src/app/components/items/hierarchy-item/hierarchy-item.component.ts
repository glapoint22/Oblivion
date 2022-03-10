import { Component, Input } from '@angular/core';
import { HierarchyManager } from '../../../classes/hierarchy-manager';
import { ListItemComponent } from '../list-item/list-item.component';

@Component({
  selector: 'hierarchy-item',
  templateUrl: './hierarchy-item.component.html',
  styleUrls: ['../list-item/list-item.component.scss', '../editable-list-item/editable-list-item.component.scss', './hierarchy-item.component.scss']
})
export class HierarchyItemComponent extends ListItemComponent {
  @Input() listManager!: HierarchyManager;
}