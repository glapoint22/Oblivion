import { KeyValue } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LazyLoad } from 'common';

@Component({
  selector: 'orders-side-menu',
  templateUrl: './orders-side-menu.component.html',
  styleUrls: ['./orders-side-menu.component.scss']
})
export class OrdersSideMenuComponent extends LazyLoad implements OnInit {
  @Output() onApply: EventEmitter<KeyValue<string, string>> = new EventEmitter();
  public filters!: Array<KeyValue<string, string>>;
  public selectedFilter!: KeyValue<string, string>;

  ngOnInit(): void {
    this.addEventListeners();
  }
}