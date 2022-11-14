import { KeyValue } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { LazyLoadingService, SpinnerAction } from 'common';
import { DropdownListComponent } from '../dropdown-list/dropdown-list.component';
import { DropdownListModule } from '../dropdown-list/dropdown-list.module';

@Component({
  selector: 'dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {
  private indexOfSelectedListItem!: number;

  public dropdownList!: DropdownListComponent<KeyValue<any, any>>;
  @Input() listItems!: Array<KeyValue<any, any>>;
  @Input() selectedListItem!: KeyValue<any, any>;
  @Input() disabled!: boolean;
  @Output() onChange: EventEmitter<KeyValue<any, any>> = new EventEmitter();
  @ViewChild('base') base!: ElementRef<HTMLElement>;
  @ViewChild('tabElement') HTMLElement!: ElementRef<HTMLElement>;
  @Output() onGetTabElement: EventEmitter<ElementRef<HTMLElement>> = new EventEmitter();


  constructor(private lazyLoadingService: LazyLoadingService) { }


  ngAfterViewInit(): void {
    this.onGetTabElement.emit(this.HTMLElement);
    this.indexOfSelectedListItem = this.listItems.indexOf(this.selectedListItem);
  }

  ngOnChanges(): void {
    if (this.listItems && !this.selectedListItem) {
      this.selectedListItem = this.listItems[0];
    }
  }


  onFocus() {
    window.addEventListener("keydown", this.keyDown);
  }


  onBlur() {
    window.removeEventListener("keydown", this.keyDown);
  }


  keyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      this.onEnter();
  }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.onArrow(-1);
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.onArrow(1);
    }
  }





  onEnter() {
    console.log('hello there')
      this.loadDropdownList();
   }



  onArrow(direction: number) {
    // Increment or decrement the index (depending on direction)
    this.indexOfSelectedListItem = this.indexOfSelectedListItem + direction;

    // If the index increments to the end of the list, then loop it back to the begining of the list 
    // or if the index decrements to the begining of the list, then loop back to the end of the list
    if (this.indexOfSelectedListItem == (direction == 1 ? this.listItems.length : -1)) this.indexOfSelectedListItem = direction == 1 ? 0 : this.listItems.length - 1;

    // Select the next item in the list
    this.selectedListItem = this.listItems[this.indexOfSelectedListItem];
  }






  // ------------------------------------------------------------------------ Load Dropdown List ----------------------------------------------------------
  async loadDropdownList() {
    if (this.disabled) return;

    if (this.dropdownList) {
      this.dropdownList.close();
      return;
    }

    this.lazyLoadingService.load<DropdownListComponent<KeyValue<any, any>>, DropdownListModule>(async () => {
      const { DropdownListComponent } = await import('../dropdown-list/dropdown-list.component');
      const { DropdownListModule } = await import('../dropdown-list/dropdown-list.module');
      return {
        component: DropdownListComponent,
        module: DropdownListModule
      }
    }, SpinnerAction.None)
      .then((dropdownList: DropdownListComponent<KeyValue<any, any>>) => {
        const rect = this.base.nativeElement.getBoundingClientRect();
        const dropdownListHeight = this.listItems.length >= 10 ? 222 : this.listItems.length * 22;

        // If the list is going beyond the bottom of the screen
        if (window.innerHeight < rect.top + rect.height + dropdownListHeight) {

          // If the height of the list is longer than the screen height
          if (window.innerHeight < dropdownListHeight) {
            // Place the list at the top of the screen
            dropdownList.top = 0;
            // And make the height of the list the same height as the screen
            dropdownList.height = window.innerHeight;

            // If the height of the list is NOT longer than the screen height
          } else {

            // If the bottom of the list was to be moved above the dropdown base and it makes the top of the list go beyond the top of the screen
            if (rect.top - dropdownListHeight + 2 < 0) {
              // Keep the list under the dropdown base
              dropdownList.top = rect.top + rect.height;
              // But shorten the height of the list so it doesn't go beyond the bottom of the screen
              dropdownList.height = window.innerHeight - (rect.top + rect.height);

              // But if the bottom of the list was to be moved above the dropdown base and it doesn't make the top of the list go beyond the top of the screen
            } else {

              // Move the list above the dropdown base
              dropdownList.top = rect.top - dropdownListHeight + 2;
            }
          }
        } else {
          dropdownList.top = rect.top + rect.height;
        }



        this.dropdownList = dropdownList;
        dropdownList.list = this.listItems;
        dropdownList.left = rect.left + 1;
        dropdownList.width = rect.width - 2;
        dropdownList.selectedListItem = this.selectedListItem;
        dropdownList.baseTop = rect.top;

        dropdownList.callback = (item: KeyValue<any, any>) => {
          this.selectedListItem = item;
          this.onChange.emit(item);
        }

        dropdownList.onClose = () => {
          this.dropdownList = null!;
          this.base.nativeElement.focus();
        }
      });
  }
}