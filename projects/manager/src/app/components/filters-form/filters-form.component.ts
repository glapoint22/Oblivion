import { Component, ViewChild } from '@angular/core';
import { LazyLoad } from 'common';
import { FormFiltersComponent } from '../form-filters/form-filters.component';

@Component({
  selector: 'filters-form',
  templateUrl: './filters-form.component.html',
  styleUrls: ['./filters-form.component.scss']
})
export class FiltersFormComponent extends LazyLoad {
  @ViewChild('formFilters') formFilters!: FormFiltersComponent;

  ngAfterViewInit() {
    super.ngAfterViewInit();

    this.formFilters.onClose.subscribe(() => {
      this.close();
    })
  }


  onOpen(): void {
    this.formFilters.onOpen();
  }

  onEscape(): void {
    this.formFilters.onEscape();
  }
}