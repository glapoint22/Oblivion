import { KeyValue } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { RadioButtonLazyLoad } from 'common';

@Component({
  selector: 'reviews-side-menu',
  templateUrl: './reviews-side-menu.component.html',
  styleUrls: ['./reviews-side-menu.component.scss']
})
export class ReviewsSideMenuComponent extends RadioButtonLazyLoad implements OnInit {

  @Output() onFilterChange: EventEmitter<KeyValue<string, string>> = new EventEmitter();
  public filtersList!: Array<KeyValue<string, string>>;
  public selectedFilter!: KeyValue<string, string>;


  @Output() onSortChange: EventEmitter<KeyValue<string, string>> = new EventEmitter();
  public sortList!: Array<KeyValue<string, string>>;
  public selectedSort!: KeyValue<string, string>;

  ngOnInit(): void {
    this.addEventListeners();
  }


  onRadioButtonChange(radioButton: ElementRef<HTMLElement>) {
    if((radioButton.nativeElement.previousElementSibling as HTMLInputElement).name == 'order-filter') {
      this.onFilterChange.emit(this.filtersList[this.tabElements.indexOf(radioButton)]);
    }else {
      this.onSortChange.emit(this.sortList[this.tabElements.indexOf(radioButton) - this.filtersList.length])
    }
  }
}
