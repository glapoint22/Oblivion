import { KeyValue } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DropdownType, LazyLoad } from 'common';
import { Subject } from 'rxjs';
import { Item } from '../../../../../manager/src/app/classes/item';

@Component({
  selector: 'dropdown-list',
  templateUrl: './dropdown-list.component.html',
  styleUrls: ['./dropdown-list.component.scss']
})
export class DropdownListComponent<T extends Item | KeyValue<any, any>> extends LazyLoad {
  private indexOfSelectedListItem: number = 0;

  public list!: Array<T>;
  public top!: number;
  public left!: number;
  public width!: number;
  public height!: number;
  public baseTop!: number;
  public callback!: Function;
  public onArrowSelect!: Function;
  public DropdownType = DropdownType;
  public dropdownType!: DropdownType;
  public onClose: Subject<void> = new Subject<void>();
  public selectedListItem!: Item | KeyValue<any, any>;

  @ViewChild('listElement') listElement!: ElementRef<HTMLElement>;
  @ViewChildren('listItem') listItems!: QueryList<ElementRef<HTMLElement>>;


  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.selectedListItem) this.indexOfSelectedListItem = this.list.indexOf(this.selectedListItem as T);
    this.listItems.get(this.indexOfSelectedListItem)?.nativeElement.focus();
    window.addEventListener('mousedown', this.mousedown);
    window.addEventListener('wheel', this.windowMouseWheel);
  }


  mousedown = () => {
    this.close();
  }


  windowMouseWheel = () => {
    this.close();
  }


  onArrowDown(e: KeyboardEvent): void {
    this.onArrow(1);
  }


  onArrowUp(e: KeyboardEvent): void {
    this.onArrow(-1);
  }


  getText(listItem: T) {
    return (listItem as KeyValue<any, any>).key || (listItem as Item).name;
  }


  onScroll() {
    this.listElement.nativeElement.scrollTop = Math.round(this.listElement.nativeElement.scrollTop / 22) * 22;
  }


  onItemSelect(itemIndex: number, event?: Event) {
    if (event) event.stopPropagation();
    this.callback(this.list[itemIndex]);
    this.close();
  }



  onMouseWheel(e: WheelEvent) {
    e.preventDefault();
    e.stopPropagation();

    const delta = Math.max(-1, Math.min(1, (e.deltaY || -e.detail)));
    this.listElement.nativeElement.scrollTop += (delta * 22);
  }




  onArrow(direction: number) {
    if (!this.list || this.list.length == 0) return;

    // Increment or decrement the index (depending on direction)
    this.indexOfSelectedListItem = this.indexOfSelectedListItem + direction;

    // If the index increments to the end of the list, then loop it back to the begining of the list 
    // or if the index decrements to the begining of the list, then loop back to the end of the list
    if (this.indexOfSelectedListItem == (direction == 1 ? this.list.length : -1)) this.indexOfSelectedListItem = direction == 1 ? 0 : this.list.length - 1;

    // Select the next item in the list
    this.selectedListItem = this.list[this.indexOfSelectedListItem];

    // Set focus to the selected list item. This is so the scrollbar can scroll to it (if scrollbar exists)
    this.listItems.get(this.indexOfSelectedListItem)?.nativeElement.focus();

    this.callback(this.list[this.indexOfSelectedListItem]);

    // Call the onArrowSelect function (if defined)
    if (this.onArrowSelect) this.onArrowSelect(this.getText(this.list[this.indexOfSelectedListItem]));
  }





  onEnter(e: KeyboardEvent): void {
    this.close();
    if (!this.list || this.list.length == 0 || this.indexOfSelectedListItem == -1) return;
    this.onItemSelect(this.indexOfSelectedListItem, e);
  }


  close(): void {
    super.close();
    this.onClose.next();
  }




  ngOnDestroy() {
    window.removeEventListener('mousedown', this.mousedown);
    window.removeEventListener('wheel', this.windowMouseWheel);
  }
}