import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { List, ListUpdate, ListUpdateType } from '../../classes/list';
import { ListItem } from '../../classes/list-item';
import { ListOptions } from '../../classes/list-options';
import { ItemComponent } from '../items/item/item.component';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  public listInstance!: List;
  @Input() sourceList!: Array<ListItem>;
  @Output() onListUpdate: EventEmitter<ListUpdate> = new EventEmitter();
  @ViewChildren('item') items!: QueryList<ItemComponent>;

  public options: ListOptions = {
    isEditable: true
  }


  ngOnInit(): void {
    this.listInstance = new List();

    this.listInstance.onListUpdate.next({ deleteDisabled: true });

    // Wait for a list item to be returned from an add, edit, or delete
    this.listInstance.onListUpdate.subscribe((listUpdate) => {
      this.onListUpdate.emit(listUpdate);
    });
  }



  ngAfterViewInit() {
    this.listInstance.sourceList = this.sourceList;
    this.listInstance.items = this.items;
    this.listInstance.options = this.options;

    // Set the edit icon button delete icon button as disabled
    window.setTimeout(() => {
      this.listInstance.onListUpdate.next({ editDisabled: true, deleteDisabled: true });
    })
  }


  overButton(isOverButton: boolean) {
    this.listInstance.overButton = isOverButton;
  }


  // --------------------------- ( ADD ) --------------------------- \\

  // Editable List
  addItem() {
    this.sourceList.unshift({ id: 0, name: '' });

    window.setTimeout(() => {
      this.listInstance.addItem(this.items.find(x => x.name == '')!);
    })
  }



  // // Non-Editable List
  // addItem(id: number, name: string) {
  //   // Add the new item to the source list
  //   this.sourceList.push({ id: id, name: name });

  //   // Sort the list
  //   this.sourceList.sort((a, b) => (a.name! > b.name!) ? 1 : -1);

  //   window.setTimeout(() => {
  //     this.listInstance.addItem(this.items.find(x => x.id == id)!);
  //   })
  // }



  // // Editable Hierarchy
  // addItem(index: number) {
  //     this.sourceList.splice(index, 0, { id: 0, name: '' });

  //     window.setTimeout(() => {
  //       this.listInstance.addItem(this.items.find(x => x.id == 0)!);
  //     })
  //   }



  // // Non-Editable Hierarchy
  // addItem(index: number, id: number, name: string) {
  //   // Add the new item to the source list
  //   this.sourceList.splice(index, 0, { id: id, name: name });

  //   // Sort the list
  //   this.sourceList.sort((a, b) => (a.name! > b.name!) ? 1 : -1);

  //   window.setTimeout(() => {
  //     this.listInstance.addItem(this.items.find(x => x.id == id)!);
  //   })
  // }


  // --------------------------- ( EDIT ) --------------------------- \\

  editItem() {
    this.listInstance.editItem();
  }


  deleteItem() {
    this.listInstance.deleteItem();
  }
}