import { Component, Input } from '@angular/core';
import { CheckboxItem } from '../../../classes/checkbox-item';
import { CheckboxListManager } from '../../../classes/checkbox-list-manager';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'checkbox-list',
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss']
})
export class CheckboxListComponent extends ListComponent {
  public listManager!: CheckboxListManager;
  @Input() sourceList!: Array<CheckboxItem>;

  instantiate() {
    this.listManager = new CheckboxListManager(this.lazyLoadingService);
    this.setListOptions();
  }
}