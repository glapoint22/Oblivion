import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { LazyLoad } from 'common';
import { Item } from '../../classes/item';

@Component({
  selector: 'dropdown-list',
  templateUrl: './dropdown-list.component.html',
  styleUrls: ['./dropdown-list.component.scss']
})
export class DropdownListComponent extends LazyLoad {
  @ViewChild('listElement') listElement!: ElementRef<HTMLElement>;
  public list!: Array<Item>;
  public top!: number;
  public left!: number;
  public width!: number;
  public callback!: Function;
  public itemIndex: number = -1;


  // ------------------------------------------------------------------------ On Arrow Down ----------------------------------------------------------
  onArrowDown(e: KeyboardEvent): void {
    if (!this.list || this.list.length == 0) return;

    const input = e.target as HTMLInputElement;
    const scrollOffset = this.listElement.nativeElement.scrollTop % 22;

    // Go to the next item in the list
    this.itemIndex++;


    // If we are at the bottom of the list, go back up to the top
    if (this.itemIndex == this.list.length) {
      this.itemIndex = 0;
      this.listElement.nativeElement.scrollTo(0, 0);
    }


    // Place the name of the item in the input
    input.value = this.list[this.itemIndex].name!;

    // Adjust the scroll
    if (this.itemIndex * 22 + scrollOffset >= this.listElement.nativeElement.getBoundingClientRect().height + this.listElement.nativeElement.scrollTop) {
      this.listElement.nativeElement.scrollTo(0, this.listElement.nativeElement.scrollTop + 22 - scrollOffset);
    }

    e.preventDefault();
  }





  // ------------------------------------------------------------------------- On Arrow Up ----------------------------------------------------------
  onArrowUp(e: KeyboardEvent): void {
    if (!this.list || this.list.length == 0) return;

    const input = e.target as HTMLInputElement;
    const scrollOffset = 22 - this.listElement.nativeElement.scrollTop % 22;



    // Go to the previous item in the list
    this.itemIndex--;

    // If we are at the top of the list, go back down to the bottom
    if (this.itemIndex == -1) {
      this.itemIndex = this.list.length - 1;
      this.listElement.nativeElement.scrollTo(0, this.listElement.nativeElement.scrollHeight);
    }

    // Place the name of the item in the input
    input.value = this.list[this.itemIndex].name!;


    // Adjust the scroll
    if (this.itemIndex * 22 - (scrollOffset < 22 ? scrollOffset : 0) <= this.listElement.nativeElement.scrollTop - 22) {
      this.listElement.nativeElement.scrollTo(0, this.listElement.nativeElement.scrollTop - 22 + (scrollOffset < 22 ? scrollOffset : 0));
    }

    e.preventDefault();
  }






  // ------------------------------------------------------------------------- On Item Select ----------------------------------------------------------
  onItemSelect(event: Event) {
    event.stopPropagation();
    this.callback(this.list[this.itemIndex]);
    this.close()
  }






  // ----------------------------------------------------------------------------- On Enter --------------------------------------------------------------
  onEnter(e: KeyboardEvent): void {
    if (!this.list || this.list.length == 0 || this.itemIndex == -1) return;
    this.onItemSelect(e);
  }




  // --------------------------------------------------------------------------- On Window Click -----------------------------------------------------------
  @HostListener('window:click')
  onWindowClick() {
    this.close();
  }
}