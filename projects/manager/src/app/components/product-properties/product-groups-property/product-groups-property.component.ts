import { Component } from '@angular/core';
import { ProductGroupsUpdateManager } from '../../../classes/product-groups-update-manager';

@Component({
  selector: 'product-groups-property',
  templateUrl: './product-groups-property.component.html',
  styleUrls: ['./product-groups-property.component.scss']
})
export class ProductGroupsPropertyComponent extends ProductGroupsUpdateManager { }