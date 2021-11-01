import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnChanges {
  @Input() listItems!: Array<KeyValue<any, any>>;
  @Output() onSelectedListItem: EventEmitter<KeyValue<any, any>> = new EventEmitter();
  public selectedListItem!: KeyValue<any, any>;
  public showDropdownList: boolean = false;


  ngOnChanges(): void {
    if (this.listItems) {
      this.selectedListItem = this.listItems[0];
    }
  }

  onListItemClick(listItem: KeyValue<any, any>) {
    this.selectedListItem = listItem;
    this.showDropdownList = false;
    this.onSelectedListItem.emit(listItem);
  }
}