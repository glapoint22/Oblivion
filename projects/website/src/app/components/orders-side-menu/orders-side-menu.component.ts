import { KeyValue } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { RadioButtonLazyLoad } from 'common';

@Component({
  selector: 'orders-side-menu',
  templateUrl: './orders-side-menu.component.html',
  styleUrls: ['./orders-side-menu.component.scss']
})
export class OrdersSideMenuComponent extends RadioButtonLazyLoad implements OnInit {
  @Output() onApply: EventEmitter<KeyValue<string, string>> = new EventEmitter();
  public filters!: Array<KeyValue<string, string>>;
  public selectedFilter!: KeyValue<string, string>;

  ngOnInit(): void {
    this.addEventListeners();
  }


  onRadioButtonChange(radioButton: ElementRef<HTMLElement>) {
    this.onApply.emit(this.filters[this.tabElements.indexOf(radioButton)]);
  }
}