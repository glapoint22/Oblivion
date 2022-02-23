import { Component, Input } from '@angular/core';
import { HierarchyType } from '../../classes/enums';
import { Hierarchy } from '../../classes/hierarchy';

@Component({
  selector: 'hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.scss']
})
export class HierarchyComponent {
  @Input() hierarchy!: Hierarchy
  @Input() hierarchyType!: HierarchyType;
}