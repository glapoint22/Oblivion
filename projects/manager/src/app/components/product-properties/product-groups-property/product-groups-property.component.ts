import { Component } from '@angular/core';
import { ProductProductGroupsManager } from '../../../classes/product-product-groups-manager';

@Component({
  selector: 'product-groups-property',
  templateUrl: './product-groups-property.component.html',
  styleUrls: ['./product-groups-property.component.scss']
})
export class ProductGroupsPropertyComponent extends ProductProductGroupsManager { }