import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';

@Component({
  selector: 'orders-side-menu',
  templateUrl: './orders-side-menu.component.html',
  styleUrls: ['./orders-side-menu.component.scss']
})
export class OrdersSideMenuComponent extends LazyLoad {
  @Output() onApply: EventEmitter<KeyValue<string, string>> = new EventEmitter();
  public filters!: Array<KeyValue<string, string>>;
  public selectedFilter!: KeyValue<string, string>;

  onOpen() {
    document.getElementById('menuContainer')?.focus();
  }

  
}