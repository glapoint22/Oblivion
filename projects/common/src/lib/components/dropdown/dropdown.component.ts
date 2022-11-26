import { KeyValue } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DropdownType, SpinnerAction } from '../../classes/enums';
import { LazyLoadingService } from '../../services/lazy-loading/lazy-loading.service';
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
  public DropdownType = DropdownType;
  @Input() disabled!: boolean;
  @Input() dropdownType!: DropdownType;
  @Input() list!: Array<KeyValue<any, any>>;
  @Input() selectedListItem!: KeyValue<any, any>;
  @ViewChild('base') base!: ElementRef<HTMLElement>;
  @ViewChild('tabElement') HTMLElement!: ElementRef<HTMLElement>;
  @Output() onChange: EventEmitter<KeyValue<any, any>> = new EventEmitter();
  @Output() onGetTabElement: EventEmitter<ElementRef<HTMLElement>> = new EventEmitter();


  constructor(private lazyLoadingService: LazyLoadingService) { }


  ngOnChanges(): void {
    if (this.list && !this.selectedListItem) this.selectedListItem = this.list[0];
  }


  ngAfterViewInit(): void {
    this.onGetTabElement.emit(this.HTMLElement);
    if (this.list) this.indexOfSelectedListItem = this.list.indexOf(this.selectedListItem);
  }


  onFocus() {
    window.addEventListener("keydown", this.keyDown);
  }


  onBlur() {
    window.removeEventListener("keydown", this.keyDown);
  }


  keyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.onArrow(-1);
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.onArrow(1);
    }
  }



  onArrow(direction: number) {
    // Increment or decrement the index (depending on direction)
    this.indexOfSelectedListItem = this.indexOfSelectedListItem + direction;

    // If the index increments to the end of the list, then loop it back to the begining of the list 
    // But, if the index decrements to the begining of the list, then loop back to the end of the list
    if (this.indexOfSelectedListItem == (direction == 1 ? this.list.length : -1)) this.indexOfSelectedListItem = direction == 1 ? 0 : this.list.length - 1;

    // Select the next item in the list
    this.selectedListItem = this.list[this.indexOfSelectedListItem];
  }



  openDropdownList() {
    if (this.disabled && this.dropdownList) return;

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

        if (this.list) {
          const rect = this.base.nativeElement.getBoundingClientRect();
          const dropdownListHeight = this.list.length >= 10 ? 222 : (this.list.length * 22) + 2;

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
              if (rect.top - dropdownListHeight < 0) {
                // Keep the list under the dropdown base
                dropdownList.top = (rect.top + window.scrollY) + rect.height;
                // But shorten the height of the list so it doesn't go beyond the bottom of the screen
                dropdownList.height = window.innerHeight - (rect.top + rect.height);

                // But if the bottom of the list was to be moved above the dropdown base and it doesn't make the top of the list go beyond the top of the screen
              } else {

                // Move the list above the dropdown base
                dropdownList.top = (rect.top + window.scrollY) - dropdownListHeight + 2 - (this.dropdownType == DropdownType.Manager ? 0 : 4);
              }
            }
          } else {
            dropdownList.top = (rect.top + window.scrollY) + rect.height;
          }

          this.dropdownList = dropdownList;
          dropdownList.list = this.list;
          dropdownList.left = rect.left + 1;
          dropdownList.width = rect.width - 2;
          dropdownList.selectedListItem = this.selectedListItem;
          dropdownList.baseTop = rect.top + window.scrollY;
          dropdownList.dropdownType = this.dropdownType;

          dropdownList.onItemSelect = (item: KeyValue<any, any>) => {
            this.selectedListItem = item;
            this.onChange.emit(item);
          }

          const dropdownCloseListener = this.dropdownList.onClose.subscribe(() => {
            dropdownCloseListener.unsubscribe();
            window.setTimeout(() => {
              this.dropdownList = null!;
            })

            this.base.nativeElement.focus();
          });
        }
      });
  }
}