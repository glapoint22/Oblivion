import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent implements OnChanges {
  @Input() listItems!: Array<KeyValue<any, any>>;
  @Output() onSelectedListItem: EventEmitter<KeyValue<any, any>> = new EventEmitter();
  @Input() selectedListItem!: KeyValue<any, any>;
  public showDropdownList: boolean = false;
  public submitedListItem!: KeyValue<any, any>;


  ngOnChanges(): void {
    if (this.listItems && !this.selectedListItem) {
      this.selectedListItem = this.listItems[0];
    }
    if(!this.submitedListItem) this.submitedListItem = this.selectedListItem;
  }



  onListItemClick(listItem: KeyValue<any, any>) {
    this.selectedListItem = listItem;
    this.showDropdownList = false;
    this.selectListItem();
  }


  onDropdownFocus() {
    document.addEventListener("keydown", this.onKeyDown);
  }


  onDropdownBlur() {
    if(this.showDropdownList) {
      this.selectListItem();
    }
    
    this.showDropdownList = false;
    document.removeEventListener("keydown", this.onKeyDown);
  }


  onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      this.showDropdownList = false;
      this.selectListItem();
    }

    if (e.key === 'Enter') {
      this.showDropdownList = false;
      this.selectListItem();
    }

    if (e.key === 'ArrowUp') {
      let index = Math.max(1, this.listItems.indexOf(this.selectedListItem));
      this.selectedListItem = this.listItems[index - 1];
      if (!this.showDropdownList) this.selectListItem();
        e.preventDefault()
    }

    if (e.key === 'ArrowDown') {
      let index = Math.min(this.listItems.length - 2, this.listItems.indexOf(this.selectedListItem));
      this.selectedListItem = this.listItems[index + 1];
      if (!this.showDropdownList) this.selectListItem();
      e.preventDefault()
    }
  }


  selectListItem() {
    if (this.submitedListItem != this.selectedListItem) {
      this.onSelectedListItem.emit(this.selectedListItem);
      this.submitedListItem = this.selectedListItem;
    }
  }
}