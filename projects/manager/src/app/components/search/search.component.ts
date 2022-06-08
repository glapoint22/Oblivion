import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DataService, LazyLoadingService, SpinnerAction } from 'common';
import { debounceTime, fromEvent, of, switchMap } from 'rxjs';
import { Item } from '../../classes/item';
import { DropdownListComponent } from '../dropdown-list/dropdown-list.component';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  @Input() apiUrl!: string;
  @Input() placeholderText!: string;
  @Output() onItemSelect: EventEmitter<Item> = new EventEmitter();
  @ViewChild('searchContainer') searchContainer!: ElementRef<HTMLElement>;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  private dropdownList!: DropdownListComponent;

  constructor(private dataService: DataService, private lazyLoadingService: LazyLoadingService) { }

  // ------------------------------------------------------------------------ Ng After View Init ----------------------------------------------------------
  ngAfterViewInit() {
    fromEvent(this.searchInput.nativeElement, 'input')
      .pipe(
        debounceTime(200),
        switchMap(input => {
          const searchTerm = (input.target as HTMLInputElement).value;

          if (searchTerm == '') {
            this.dropdownList.close();
            this.dropdownList = null!;
            return of([]);
          }
          return this.dataService.get<Array<Item>>('api/' + this.apiUrl, [{ key: 'searchTerm', value: searchTerm }])
        })
      ).subscribe((results: Array<Item>) => {

        // See if dropdown list is already loaded
        if (!document.getElementById('dropdownList')) {
          this.loadDropdownList(results);

          // The dropdown list is already loaded
        } else {
          if (this.dropdownList) this.dropdownList.list = results;
        }
      })
  }



  // ------------------------------------------------------------------------ Load Dropdown List ----------------------------------------------------------
  async loadDropdownList(results: Array<Item>) {
    this.lazyLoadingService.load(async () => {
      const { DropdownListComponent } = await import('../dropdown-list/dropdown-list.component');
      const { DropdownListModule } = await import('../dropdown-list/dropdown-list.module');
      return {
        component: DropdownListComponent,
        module: DropdownListModule
      }
    }, SpinnerAction.None)
      .then((dropdownList: DropdownListComponent) => {
        const rect = this.searchContainer.nativeElement.getBoundingClientRect();

        this.dropdownList = dropdownList;
        this.dropdownList.list = results;
        this.dropdownList.top = rect.top + rect.height;
        this.dropdownList.left = rect.left;
        this.dropdownList.width = rect.width;
        this.dropdownList.callback = (item: Item) => {
          this.searchInput.nativeElement.value = item.name!;
          this.dropdownList = null!;
          this.searchInput.nativeElement.focus();
          this.onItemSelect.emit(item);
        }
      });
  }



  // ------------------------------------------------------------------------------ Clear -------------------------------------------------------------
  public clear() {
    this.searchInput.nativeElement.value = '';
  }



  // -------------------------------------------------------------------------- Ng On Destroy ----------------------------------------------------------
  ngOnDestroy() {
    if (this.dropdownList) {
      this.dropdownList.close();
    }
  }
}