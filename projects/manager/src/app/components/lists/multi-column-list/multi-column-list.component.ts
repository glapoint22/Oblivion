import { Component, Input } from '@angular/core';
import { MultiColumnItem } from '../../../classes/multi-column-item';
import { MultiColumnListManager } from '../../../classes/multi-column-list-manager';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'multi-column-list',
  templateUrl: './multi-column-list.component.html',
  styleUrls: ['./multi-column-list.component.scss']
})
export class MultiColumnListComponent extends ListComponent {
  public listManager!: MultiColumnListManager;
  @Input() sourceList!: Array<MultiColumnItem>;

  instantiate() {
    this.listManager = new MultiColumnListManager(this.lazyLoadingService);
  }

  edit() {
    this.listManager.setValueEdit(this.listManager.selectedItem as MultiColumnItem, (this.listManager.selectedItem as MultiColumnItem).values[0]);
  }
}