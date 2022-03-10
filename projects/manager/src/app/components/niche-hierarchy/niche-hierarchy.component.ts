import { Component, Input, ViewChild } from '@angular/core';
import { HierarchyItem } from '../../classes/hierarchy-item';
import { ListUpdate } from '../../classes/list-update';
import { EditableHierarchyComponent } from '../hierarchies/editable-hierarchy/editable-hierarchy.component';

@Component({
  selector: 'niche-hierarchy',
  templateUrl: './niche-hierarchy.component.html',
  styleUrls: ['./niche-hierarchy.component.scss']
})
export class NicheHierarchyComponent {
  @Input() niches!: Array<HierarchyItem>;
  @ViewChild('hierarchy') hierarchy!: EditableHierarchyComponent;
  public isParent!: boolean;
  public listUpdate: ListUpdate = new ListUpdate();


  

  onListUpdate(listUpdate: ListUpdate) {


  }
}