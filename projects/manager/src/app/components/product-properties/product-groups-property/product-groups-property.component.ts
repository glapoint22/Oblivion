import { Component, Input } from '@angular/core';
import { ListUpdate } from '../../../classes/list-update';
import { ListItem } from '../../../classes/list-item';
import { ListUpdateType } from '../../../classes/enums';

@Component({
  selector: 'product-groups-property',
  templateUrl: './product-groups-property.component.html',
  styleUrls: ['./product-groups-property.component.scss']
})
export class ProductGroupsPropertyComponent {
  @Input() productGroups!: Array<ListItem>;
  private _listUpdate: ListUpdate = new ListUpdate();
  

  public get listUpdate(): ListUpdate {
    return this._listUpdate;
  }
  public set listUpdate(v: ListUpdate) {
    this._listUpdate = v;

    if (v.type == ListUpdateType.Add) {
      // this.productGroups[v.index!].id = 22;
    }

    if (v.type == ListUpdateType.Delete) {
      // console.log(v.deletedItems)
    }
  }
}