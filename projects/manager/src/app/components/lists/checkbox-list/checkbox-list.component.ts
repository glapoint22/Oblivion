import { Component } from '@angular/core';
import { LazyLoadingService } from 'common';
import { CheckboxListManager } from '../../../classes/checkbox-list-manager';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'checkbox-list',
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss']
})
export class CheckboxListComponent extends ListComponent {
  public listManager!: CheckboxListManager;

  constructor(lazyLoadingService: LazyLoadingService) {
    super(lazyLoadingService);
  }

  instantiate() {
    this.listManager = new CheckboxListManager(this.lazyLoadingService);
  }
}