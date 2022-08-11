import { Component } from '@angular/core';
import { HierarchyManager } from '../../../classes/hierarchy-manager';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'hierarchy-list',
  templateUrl: './hierarchy-list.component.html',
  styleUrls: ['./hierarchy-list.component.scss']
})
export class HierarchyListComponent extends ListComponent {
  public listManager!: HierarchyManager;

  instantiate() {
    this.listManager = new HierarchyManager(this.lazyLoadingService);
  }
}