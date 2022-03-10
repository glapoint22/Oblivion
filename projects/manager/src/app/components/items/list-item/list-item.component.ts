import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ItemSelectType } from '../../../classes/enums';
import { ListManager } from '../../../classes/list-manager';

@Component({
  selector: 'list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss']
})
export class ListItemComponent {
  @Input() id!: number;
  @Input() listManager!: ListManager;
  @ViewChild('htmlItem') htmlItem!: ElementRef<HTMLElement>;

  ngAfterViewInit() {
    window.setTimeout(()=> {
      this.listManager.getItem(this).htmlItem = this.htmlItem;
    })
    
  }
}