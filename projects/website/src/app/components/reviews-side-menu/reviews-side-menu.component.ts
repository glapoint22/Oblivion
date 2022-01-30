import { KeyValue } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';

@Component({
  selector: 'reviews-side-menu',
  templateUrl: './reviews-side-menu.component.html',
  styleUrls: ['./reviews-side-menu.component.scss']
})
export class ReviewsSideMenuComponent extends LazyLoad {

  @Output() onFilterChange: EventEmitter<KeyValue<string, string>> = new EventEmitter();
  public filtersList!: Array<KeyValue<string, string>>;
  public selectedFilter!: KeyValue<string, string>;


  @Output() onSortChange: EventEmitter<KeyValue<string, string>> = new EventEmitter();
  public sortList!: Array<KeyValue<string, string>>;
  public selectedSort!: KeyValue<string, string>;
}
