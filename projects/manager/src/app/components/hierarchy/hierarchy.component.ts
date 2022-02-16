import { Component, Input, OnInit } from '@angular/core';
import { Hierarchy, HierarchyType } from '../../classes/hierarchy';

@Component({
  selector: 'hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.scss']
})
export class HierarchyComponent {
  @Input() hierarchy!: Hierarchy
  @Input() hierarchyType!: HierarchyType;

  ngOnInit(){
    console.log(this.hierarchyType)
  }
}