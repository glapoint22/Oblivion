import { KeyValue } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { LazyLoad } from 'common';
import { Item } from '../../classes/item';

@Component({
  selector: 'dropdown-list',
  templateUrl: './dropdown-list.component.html',
  styleUrls: ['./dropdown-list.component.scss']
})
export class DropdownListComponent<T extends Item | KeyValue<any, any>> extends LazyLoad {
  public list!: Array<T>;
  public top!: number;
  public left!: number;
  public width!: number;
  public height!: number;
  public callback!: Function;
  public onClose!: Function;
  public onArrowSelect!: Function;
  public itemIndex: number = -1;
  public selectedListItem!: Item | KeyValue<any, any>;
  public baseTop!: number;
  @ViewChild('listElement') listElement!: ElementRef<HTMLElement>;
  @ViewChildren('listItem') listItems!: QueryList<ElementRef<HTMLElement>>;


  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.itemIndex = this.list.indexOf(this.selectedListItem as T);
    this.listItems.get(this.itemIndex)?.nativeElement.focus();
    window.addEventListener('mousedown', this.mousedown);
    window.addEventListener('wheel', this.windowMouseWheel);
  }


  mousedown = () => {
    this.close();
  }

  onScroll() {
    this.listElement.nativeElement.scrollTop = Math.round(this.listElement.nativeElement.scrollTop / 22) * 22;
  }




  windowMouseWheel = () => {
    this.close();
  }



  onMouseWheel(e: WheelEvent) {
    e.preventDefault();
    e.stopPropagation();

    const delta = Math.max(-1, Math.min(1, (e.deltaY || -e.detail)));
    this.listElement.nativeElement.scrollTop += (delta * 22);
  }






  // ------------------------------------------------------------------------ On Arrow Down ----------------------------------------------------------
  onArrowDown(e: KeyboardEvent): void {
    this.onArrow(1);
  }









  // ------------------------------------------------------------------------- On Arrow Up ----------------------------------------------------------
  onArrowUp(e: KeyboardEvent): void {
    this.onArrow(-1);
  }



  onArrow(direction: number) {
    if (!this.list || this.list.length == 0) return;

    // Increment or decrement the index (depending on direction)
    this.itemIndex = this.itemIndex + direction;

    // If the index increments to the end of the list, then loop it back to the begining of the list 
    // or if the index decrements to the begining of the list, then loop back to the end of the list
    if (this.itemIndex == (direction == 1 ? this.list.length : -1)) this.itemIndex = direction == 1 ? 0 : this.list.length - 1;

    // Select the next item in the list
    this.selectedListItem = this.list[this.itemIndex];

    // Set focus to the selected list item. This is so the scrollbar can scroll to it (if scrollbar exists)
    this.listItems.get(this.itemIndex)?.nativeElement.focus();

    this.callback(this.list[this.itemIndex]);

    // Call the onArrowSelect function (if defined)
    if (this.onArrowSelect) this.onArrowSelect(this.getText(this.list[this.itemIndex]));
  }



  getText(listItem: T) {
    return (listItem as KeyValue<any, any>).key || (listItem as Item).name;
  }


  // ------------------------------------------------------------------------- On Item Select ----------------------------------------------------------
  onItemSelect(itemIndex: number, event?: Event) {
    if (event) event.stopPropagation();
    this.callback(this.list[itemIndex]);
    this.close();
  }






  // ----------------------------------------------------------------------------- On Enter --------------------------------------------------------------
  onEnter(e: KeyboardEvent): void {
    if (!this.list || this.list.length == 0 || this.itemIndex == -1) return;
    this.onItemSelect(this.itemIndex, e);
  }




  






  // -------------------------------------------------------------------------------- Close ----------------------------------------------------------------
  close(): void {
    super.close();
    if (this.onClose) this.onClose();
  }



  // ------------------------------------------------------------------- NG On Destroy --------------------------------------------------

  ngOnDestroy() {
    window.removeEventListener('mousedown', this.mousedown);
    window.removeEventListener('wheel', this.windowMouseWheel);
  }
}