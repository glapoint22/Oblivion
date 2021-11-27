import { Component, EventEmitter, Output } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';
import { List } from '../../classes/list';

@Component({
  selector: 'lists-side-menu',
  templateUrl: './lists-side-menu.component.html',
  styleUrls: ['./lists-side-menu.component.scss']
})
export class ListsSideMenuComponent extends LazyLoad {
  @Output() onListClick: EventEmitter<List> = new EventEmitter();
  @Output() onCreateNewListClick: EventEmitter<void> = new EventEmitter();
  public lists!: Array<List>;
  public selectedList!: List;
  
  onOpen() {
    document.getElementById('menuContainer')?.focus();
  }
}
