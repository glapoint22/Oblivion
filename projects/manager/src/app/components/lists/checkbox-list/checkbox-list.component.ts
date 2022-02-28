import { Component } from '@angular/core';
import { CheckboxListManager } from '../../../classes/checkbox-list';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'checkbox-list',
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss']
})
export class CheckboxListComponent extends ListComponent {
  public listManager!: CheckboxListManager;

  instantiate() {
    this.listManager = new CheckboxListManager();
  }
}