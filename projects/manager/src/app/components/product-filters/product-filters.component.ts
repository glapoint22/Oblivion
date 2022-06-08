import { Component } from '@angular/core';
import { ProductFiltersUpdateManager } from '../../classes/product-filters-update-manager';

@Component({
  selector: 'product-filters',
  templateUrl: './product-filters.component.html',
  styleUrls: ['./product-filters.component.scss']
})
export class ProductFiltersComponent extends ProductFiltersUpdateManager { }