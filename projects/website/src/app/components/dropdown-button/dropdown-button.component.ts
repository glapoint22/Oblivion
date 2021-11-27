import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'dropdown-button',
  templateUrl: './dropdown-button.component.html',
  styleUrls: ['../dropdown/dropdown.component.scss','./dropdown-button.component.scss']
})
export class DropdownButtonComponent {
  @Input() listItems!: Array<KeyValue<any, any>>;
  @Input() disabled!: boolean;
  @Output() onSelectedListItem: EventEmitter<KeyValue<any, any>> = new EventEmitter();
  public showDropdownList: boolean = false;


  onListItemClick(listItem: KeyValue<any, any>) {
    this.showDropdownList = false;
    this.onSelectedListItem.emit(listItem);
  }
}