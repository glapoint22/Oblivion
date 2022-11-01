import { Component, ViewChild } from '@angular/core';
import { LazyLoad } from 'common';
import { Subject } from 'rxjs';
import { ProductFiltersComponent } from '../../../../product-filters/product-filters.component';

@Component({
  selector: 'app-filters-popup',
  templateUrl: './filters-popup.component.html',
  styleUrls: ['./filters-popup.component.scss']
})
export class FiltersPopupComponent extends LazyLoad {
  public productId!: number;
  public productIndex!: number;
  public onClose: Subject<void> = new Subject<void>();
  @ViewChild('productFilters') productFilters!: ProductFiltersComponent;

  ngOnInit() {
    super.ngOnInit();
    window.addEventListener('mousedown', this.mousedown);
  }


  mousedown = () => {
    this.close();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.productFilters.onClose.subscribe(() => this.close());
  }


  onOpen(): void {
    this.productFilters.onOpen();
  }

  onEscape(): void {
    this.productFilters.onEscape();
  }


  close(): void {
    super.close();
    this.onClose.next();
  }


  ngOnDestroy() {
    window.removeEventListener('mousedown', this.mousedown);
  }
 }