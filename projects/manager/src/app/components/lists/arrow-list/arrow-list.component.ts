import { Component } from '@angular/core';
import { ArrowListManager } from '../../../classes/arrow-list-manager';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'arrow-list',
  templateUrl: './arrow-list.component.html',
  styleUrls: ['./arrow-list.component.scss']
})
export class ArrowListComponent extends ListComponent {
  public listManager!: ArrowListManager;

  instantiate() {
    this.listManager = new ArrowListManager();
  }
}