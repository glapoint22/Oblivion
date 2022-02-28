import { Component } from '@angular/core';
import { CheckboxList } from '../../../classes/checkbox-list';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'checkbox-list',
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss']
})
export class CheckboxListComponent extends ListComponent {
  public list!: CheckboxList;

  instantiate() {
    this.list = new CheckboxList();
  }
}