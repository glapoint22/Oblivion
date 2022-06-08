import { Component } from '@angular/core';
import { ProductFiltersUpdateManager } from '../../../classes/product-filters-update-manager';

@Component({
  selector: 'product-filters-property',
  templateUrl: './product-filters-property.component.html',
  styleUrls: ['./product-filters-property.component.scss']
})
export class ProductFiltersPropertyComponent extends ProductFiltersUpdateManager { }