import { Component, ViewChild } from '@angular/core';
import { LazyLoad } from 'common';
import { ProductFiltersComponent } from '../product-filters/product-filters.component';

@Component({
  selector: 'app-filters-popup',
  templateUrl: './filters-popup.component.html',
  styleUrls: ['./filters-popup.component.scss']
})
export class FiltersPopupComponent extends LazyLoad {
  public productId!: number;
  public productIndex!: number;
  @ViewChild('productFilters') productFilters!: ProductFiltersComponent;



  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.productFilters.productId = this.productId;
    this.productFilters.onClose.subscribe(() => this.close());
  }


  onOpen(): void {
    this.productFilters.onOpen();
  }

  onEscape(): void {
    this.productFilters.onEscape();
  }
 }