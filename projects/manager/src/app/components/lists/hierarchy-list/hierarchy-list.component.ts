import { Component } from '@angular/core';
import { LazyLoadingService } from 'common';
import { HierarchyManager } from '../../../classes/hierarchy-manager';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'hierarchy-list',
  templateUrl: './hierarchy-list.component.html',
  styleUrls: ['./hierarchy-list.component.scss']
})
export class HierarchyListComponent extends ListComponent {
  public listManager!: HierarchyManager;

  constructor(lazyLoadingService: LazyLoadingService) {
    super(lazyLoadingService)
  }

  instantiate() {
    this.listManager = new HierarchyManager(this.lazyLoadingService);
  }
}