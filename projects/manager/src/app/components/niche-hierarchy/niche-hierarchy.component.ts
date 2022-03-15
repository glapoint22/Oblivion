import { Component, Input } from '@angular/core';
import { ListUpdateType } from '../../classes/enums';
import { HierarchyItem } from '../../classes/hierarchy-item';
import { ListUpdate } from '../../classes/list-update';

@Component({
  selector: 'niche-hierarchy',
  templateUrl: './niche-hierarchy.component.html',
  styleUrls: ['./niche-hierarchy.component.scss']
})
export class NicheHierarchyComponent {
  @Input() niches!: Array<HierarchyItem>;
  public isParent!: boolean;
  private _listUpdate: ListUpdate = new ListUpdate();



  public get listUpdate(): ListUpdate {
    return this._listUpdate;
  }
  public set listUpdate(v: ListUpdate) {
    this._listUpdate = v;

    if (v.type == ListUpdateType.Add) {
      // this.niches[v.index!].id = 22;
    }

    if (v.type == ListUpdateType.Delete) {
      // console.log(v.deletedItems)
    }

    if (v.type == ListUpdateType.ArrowClicked) {
      // console.log(v.hasChildren)
    }
  }
}