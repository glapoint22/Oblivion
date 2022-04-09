import { Component, ElementRef, Input, QueryList, ViewChildren } from '@angular/core';
import { MultiColumnItem } from '../../../classes/multi-column-item';
import { MultiColumnListManager } from '../../../classes/multi-column-list-manager';
import { ListItemComponent } from '../list-item/list-item.component';

@Component({
  selector: 'multi-column-item',
  templateUrl: './multi-column-item.component.html',
  styleUrls: ['../list-item/list-item.component.scss', './multi-column-item.component.scss']
})
export class MultiColumnItemComponent extends ListItemComponent {
  @Input() item!: MultiColumnItem;
  @Input() listManager!: MultiColumnListManager;
  @ViewChildren('htmlValue') htmlValue!: QueryList<ElementRef<HTMLElement>>;

  ngAfterViewInit() {
    super.ngAfterViewInit();
    for(let i = 0; i < this.htmlValue.length; i++) {
      this.item.values[i].htmlValue = this.htmlValue.get(i)!;
    }
  }
}