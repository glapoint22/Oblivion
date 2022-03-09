import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ItemSelectType } from '../../../classes/enums';
import { ListManager } from '../../../classes/list-manager';

@Component({
  selector: 'item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {
  @Input() id!: number;
  @Input() listManager!: ListManager;
  @ViewChild('htmlItem') htmlItem!: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    window.setTimeout(()=> {
      this.listManager.getListItem(this).htmlItem = this.htmlItem;
    })
    
  }
}