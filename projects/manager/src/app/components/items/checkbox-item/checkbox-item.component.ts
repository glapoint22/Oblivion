import { Component, Input } from '@angular/core';
import { CheckboxHierarchyManager } from '../../../classes/checkbox-hierarchy-manager';
import { ListItemComponent } from '../list-item/list-item.component';

@Component({
  selector: 'checkbox-item',
  templateUrl: './checkbox-item.component.html',
  styleUrls: ['../list-item/list-item.component.scss', './checkbox-item.component.scss']
})
export class CheckboxItemComponent extends ListItemComponent {
  @Input() listManager!: CheckboxHierarchyManager;
}