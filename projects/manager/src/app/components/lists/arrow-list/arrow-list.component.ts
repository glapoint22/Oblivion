import { Component } from '@angular/core';
import { ArrowList } from '../../../classes/arrow-list';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'arrow-list',
  templateUrl: './arrow-list.component.html',
  styleUrls: ['./arrow-list.component.scss']
})
export class ArrowListComponent extends ListComponent {
  public list!: ArrowList;

  instantiate() {
    this.list = new ArrowList();
  }
}