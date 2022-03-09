import { Component, Input, ViewChild } from '@angular/core';
import { Hierarchy } from '../../classes/hierarchy';
import { ListUpdate } from '../../classes/list-update';
import { EditableHierarchyComponent } from '../hierarchies/editable-hierarchy/editable-hierarchy.component';

@Component({
  selector: 'niche-hierarchy',
  templateUrl: './niche-hierarchy.component.html',
  styleUrls: ['./niche-hierarchy.component.scss']
})
export class NicheHierarchyComponent {
  @Input() niches!: Array<Hierarchy>;
  @ViewChild('hierarchy') hierarchy!: EditableHierarchyComponent;
  public isParent!: boolean;
  public listUpdate: ListUpdate = new ListUpdate();


  

  onListUpdate(listUpdate: ListUpdate) {


  }
}