import { Component, Input } from '@angular/core';
import { CheckboxMultiColumnItem } from '../../../classes/checkbox-multi-column-item';
import { CheckboxMultiColumnListManager } from '../../../classes/checkbox-multi-column-list-manager';
import { MultiColumnListComponent } from '../multi-column-list/multi-column-list.component';

@Component({
  selector: 'checkbox-multi-column-list',
  templateUrl: './checkbox-multi-column-list.component.html',
  styleUrls: ['./checkbox-multi-column-list.component.scss']
})
export class CheckboxMultiColumnListComponent extends MultiColumnListComponent {
  public listManager!: CheckboxMultiColumnListManager;
  @Input() parentSearchType!: string;
  @Input() sourceList!: Array<CheckboxMultiColumnItem>;

  instantiate() {
    this.listManager = new CheckboxMultiColumnListManager(this.lazyLoadingService);
  }
}