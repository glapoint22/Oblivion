import { Component } from '@angular/core';
import { ProductFiltersManager } from '../../../classes/product-filters-manager';

@Component({
  selector: 'product-filters-property',
  templateUrl: './product-filters-property.component.html',
  styleUrls: ['./product-filters-property.component.scss']
})
export class ProductFiltersPropertyComponent extends ProductFiltersManager { }