import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DataService, DropdownListComponent, DropdownListModule, DropdownType, LazyLoadingService, ListItem, SpinnerAction } from 'common';
import { debounceTime, fromEvent, merge, of, switchMap } from 'rxjs';
import { Item } from '../../classes/item';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  @Input() apiUrl!: string;
  @Input() placeholderText!: string;
  @Input() clearOnSelection!: boolean;
  @Output() onItemSelect: EventEmitter<Item> = new EventEmitter();
  @ViewChild('searchContainer') searchContainer!: ElementRef<HTMLElement>;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('tabElement') tabElement!: ElementRef<HTMLElement>;
  @Output() onGetTabElement: EventEmitter<ElementRef<HTMLElement>> = new EventEmitter();
  public dropdownList!: DropdownListComponent<ListItem>;

  constructor(private dataService: DataService, private lazyLoadingService: LazyLoadingService) { }

  // ------------------------------------------------------------------------ Ng After View Init ----------------------------------------------------------
  ngAfterViewInit() {
    this.onGetTabElement.emit(this.tabElement);

    const inputEvent = fromEvent(this.searchInput.nativeElement, 'input');
    const mousedownEvent = fromEvent(this.searchInput.nativeElement, 'mousedown');
    const bothEvents = merge(inputEvent, mousedownEvent);

    bothEvents
      .pipe(
        debounceTime(200),
        switchMap(input => {
          const searchTerm = (input.target as HTMLInputElement).value;

          if (searchTerm == '') {
            if (this.dropdownList) {
              this.dropdownList.close();
              this.dropdownList = null!;
            }

            return of(null);
          }
          return this.dataService.get<Array<ListItem>>('api/' + this.apiUrl,
            [{ key: 'searchTerm', value: searchTerm }], {
            authorization: true
          })
        })
      ).subscribe((results: Array<ListItem> | null) => {
        if (results) {
          // See if dropdown list is already loaded
          if (!document.getElementById('dropdownList')) {
            this.loadDropdownList(results);

            // The dropdown list is already loaded
          } else {
            if (this.dropdownList) this.dropdownList.list = results;
          }
        }

      })
  }



  // ------------------------------------------------------------------------ Load Dropdown List ----------------------------------------------------------
  async loadDropdownList(results: Array<ListItem>) {
    this.lazyLoadingService.load<DropdownListComponent<ListItem>, DropdownListModule>(async () => {
      const { DropdownListComponent } = await import('common');
      const { DropdownListModule } = await import('common');
      return {
        component: DropdownListComponent,
        module: DropdownListModule
      }
    }, SpinnerAction.None)
      .then((dropdownList: DropdownListComponent<ListItem>) => {
        const rect = this.searchContainer.nativeElement.getBoundingClientRect();
        dropdownList.dropdownType = DropdownType.Manager;
        this.dropdownList = dropdownList;
        this.dropdownList.list = results;
        this.dropdownList.top = rect.top + rect.height;
        this.dropdownList.left = rect.left;
        this.dropdownList.width = rect.width;

        // Callback
        this.dropdownList.onItemSubmit = (item: Item) => {
          this.searchInput.nativeElement.value = item.name!;
          this.dropdownList = null!;
          this.searchInput.nativeElement.focus();
          this.onItemSelect.emit(item);
          if (this.clearOnSelection) this.clear();
        }

        this.dropdownList.onArrowSelect = (text: string) => {
          this.searchInput.nativeElement.value = text;
        }

        const dropdownCloseListener = this.dropdownList.onClose.subscribe(() => {
          dropdownCloseListener.unsubscribe();
          this.dropdownList = null!;
        });
      });
  }



  // ------------------------------------------------------------------------------ Clear -------------------------------------------------------------
  public clear() {
    this.searchInput.nativeElement.value = '';

    if (this.dropdownList) {
      this.dropdownList.close();
      this.dropdownList = null!;
    }
  }



  // -------------------------------------------------------------------------- Ng On Destroy ----------------------------------------------------------
  ngOnDestroy() {
    if (this.dropdownList) {
      this.dropdownList.close();
    }
  }
}