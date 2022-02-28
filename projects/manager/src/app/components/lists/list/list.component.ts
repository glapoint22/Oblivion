import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { List, ListUpdate } from '../../../classes/list';
import { ListItem } from '../../../classes/list-item';
import { ListOptions } from '../../../classes/list-options';
import { ItemComponent } from '../../items/item/item.component';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  public list!: List;
  @Input() sourceList!: Array<ListItem>;
  @Output() onListUpdate: EventEmitter<ListUpdate> = new EventEmitter();
  @ViewChildren('item') items!: QueryList<ItemComponent>;

  public options: ListOptions = {}

  instantiate() {
    this.list = new List();
  }


  ngOnInit(): void {
    this.instantiate();

    // Wait for a list item to be returned from an add, edit, or delete
    this.list.onListUpdate.subscribe((listUpdate) => {
      this.onListUpdate.emit(listUpdate);
    });
  }



  ngAfterViewInit() {
    this.list.sourceList = this.sourceList;
    this.list.items = this.items;
    this.list.options = this.options;

    // Set the edit icon button and the delete icon button as disabled
    window.setTimeout(() => {
      this.list.onListUpdate.next({ editDisabled: true, deleteDisabled: true });
    })
  }


  overButton(isOverButton: boolean) {
    this.list.overButton = isOverButton;
  }


  // --------------------------- ( ADD ) --------------------------- \\


  addItem(id?: number, name?: string) {
    // Add the new item to the source list
    this.sourceList.push({ id: id, name: name });

    // Sort the list
    this.sourceList.sort((a, b) => (a.name! > b.name!) ? 1 : -1);

    window.setTimeout(() => {
      this.list.addItem(this.items.find(x => x.id == id)!);
    })
  }



  // // Editable Hierarchy
  // addItem(index: number) {
  //     this.sourceList.splice(index, 0, { id: 0, name: '' });

  //     window.setTimeout(() => {
  //       this.list.addItem(this.items.find(x => x.id == 0)!);
  //     })
  //   }



  // // Non-Editable Hierarchy
  // addItem(index: number, id: number, name: string) {
  //   // Add the new item to the source list
  //   this.sourceList.splice(index, 0, { id: id, name: name });

  //   // Sort the list
  //   this.sourceList.sort((a, b) => (a.name! > b.name!) ? 1 : -1);

  //   window.setTimeout(() => {
  //     this.list.addItem(this.items.find(x => x.id == id)!);
  //   })
  // }


  // --------------------------- ( EDIT ) --------------------------- \\




  deleteItem() {
    this.list.deleteItem();
  }
}