import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ListItem } from '../../../classes/list-item';
import { ListManager } from '../../../classes/list-manager';

@Component({
  selector: 'list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['../list-item/list-item.component.scss']
})
export class ListItemComponent {
  @Input() item!: ListItem;
  @Input() listManager!: ListManager;
  @ViewChild('htmlItem') htmlItem!: ElementRef<HTMLElement>;

  ngOnInit() {
    this.item.identity = this;
  }

  ngAfterViewInit() {
    this.item.htmlItem = this.htmlItem;
  }
}