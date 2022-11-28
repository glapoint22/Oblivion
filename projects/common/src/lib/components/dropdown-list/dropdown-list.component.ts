import { KeyValue } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Subject } from 'rxjs';
import { DropdownType } from '../../classes/enums';
import { LazyLoad } from '../../classes/lazy-load';
import { ListItem } from '../../classes/list-item';

@Component({
  selector: 'dropdown-list',
  templateUrl: './dropdown-list.component.html',
  styleUrls: ['./dropdown-list.component.scss']
})
export class DropdownListComponent<T extends ListItem | KeyValue<any, any>> extends LazyLoad {
  private indexOfSelectedListItem: number = 0;

  public list!: Array<T>;
  public top!: number;
  public left!: number;
  public width!: number;
  public height!: number;
  public baseTop!: number;
  public onItemSelect!: Function;
  public onItemSubmit!: Function;
  public onArrowSelect!: Function;
  public DropdownType = DropdownType;
  public dropdownType!: DropdownType;
  public onClose: Subject<void> = new Subject<void>();
  public selectedListItem!: ListItem | KeyValue<any, any>;

  @ViewChild('listElement') listElement!: ElementRef<HTMLElement>;
  @ViewChildren('listItem') listItems!: QueryList<ElementRef<HTMLElement>>;


  ngOnInit(): void {
    this.addEventListeners();
  }


  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.selectedListItem) {
      this.indexOfSelectedListItem = this.list.indexOf(this.selectedListItem as T);
      this.listItems.get(this.indexOfSelectedListItem)?.nativeElement.focus();
    }

    window.addEventListener('mousedown', this.mousedown);
    window.addEventListener('wheel', this.windowMouseWheel);
    window.addEventListener('blur', this.windowBlur);
  }


  mousedown = () => {
    this.close();
  }


  windowMouseWheel = () => {
    this.close();
  }


  windowBlur = () => {
    this.close();
  }


  onArrowDown(e: KeyboardEvent): void {
    this.onArrow(1);
  }


  onArrowUp(e: KeyboardEvent): void {
    this.onArrow(-1);
  }


  getText(listItem: T) {
    return (listItem as KeyValue<any, any>).key || (listItem as ListItem).name;
  }


  onScroll() {
    this.listElement.nativeElement.scrollTop = Math.round(this.listElement.nativeElement.scrollTop / 22) * 22;
  }


  submitItem(itemIndex: number, event?: Event) {
    if (event) event.stopPropagation();

    if (this.onItemSubmit) {
      this.onItemSubmit(this.list[itemIndex]);
    }
    this.close();
  }



  onMouseWheel(e: WheelEvent) {
    e.preventDefault();
    e.stopPropagation();

    const delta = Math.max(-1, Math.min(1, (e.deltaY || -e.detail)));
    this.listElement.nativeElement.scrollTop += (delta * 44);
  }




  onArrow(direction: number) {
    if (!this.list || this.list.length == 0) return;

    // Increment or decrement the index (depending on direction)
    this.indexOfSelectedListItem = this.indexOfSelectedListItem + direction;

    // If the index increments past the end of the list or decrements beyond the begining of the list, then loop back around
    if (this.indexOfSelectedListItem == (direction == 1 ? this.list.length : -1)) this.indexOfSelectedListItem = direction == 1 ? 0 : this.list.length - 1;

    // Select the next item in the list
    this.selectedListItem = this.list[this.indexOfSelectedListItem];

    // Set focus to the selected list item. This is so the scrollbar can scroll to it (if scrollbar exists)
    this.listItems.get(this.indexOfSelectedListItem)?.nativeElement.focus();

    if (this.onItemSelect) {
      this.onItemSelect(this.list[this.indexOfSelectedListItem]);
    }


    // Call the onArrowSelect function (if defined)
    if (this.onArrowSelect) this.onArrowSelect(this.getText(this.list[this.indexOfSelectedListItem]));
  }





  onEnter(e: KeyboardEvent): void {
    this.close();
    if (!this.list || this.list.length == 0 || this.indexOfSelectedListItem == -1) return;
    this.submitItem(this.indexOfSelectedListItem, e);
  }


  close(): void {
    this.fade();
    this.onClose.next();
  }




  ngOnDestroy() {
    super.ngOnDestroy();
    window.removeEventListener('mousedown', this.mousedown);
    window.removeEventListener('wheel', this.windowMouseWheel);
    window.removeEventListener('blur', this.windowBlur);
  }
}