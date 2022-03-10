import { Component } from '@angular/core';
import { HierarchyManager } from '../../../classes/hierarchy-manager';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'arrow-list',
  templateUrl: './arrow-list.component.html',
  styleUrls: ['./arrow-list.component.scss']
})
export class ArrowListComponent extends ListComponent {
  public listManager!: HierarchyManager;

  instantiate() {
    this.listManager = new HierarchyManager();
  }
}