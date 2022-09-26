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
  @Input() listItems!: Array<KeyValue<any, any>>;
  @Input() selectedListItem!: KeyValue<any, any>;
  @Input() disabled!: boolean;
  @Output() onChange: EventEmitter<KeyValue<any, any>> = new EventEmitter();
  @ViewChild('base') base!: ElementRef<HTMLElement>;
  private dropdownList!: DropdownListComponent<KeyValue<any, any>>;

  constructor(private lazyLoadingService: LazyLoadingService) { }

  ngOnChanges(): void {
    if (this.listItems && !this.selectedListItem) {
      this.selectedListItem = this.listItems[0];
    }
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

        this.dropdownList = dropdownList;
        dropdownList = dropdownList;
        dropdownList.list = this.listItems;
        dropdownList.top = rect.top + rect.height;
        dropdownList.left = rect.left + 1;
        dropdownList.width = rect.width - 2;
        dropdownList.selectedListItem = this.selectedListItem;

        dropdownList.callback = (item: KeyValue<any, any>) => {
          this.selectedListItem = item;
          this.onChange.emit(item);
        }

        dropdownList.onClose = () => this.dropdownList = null!;
      });
  }
}