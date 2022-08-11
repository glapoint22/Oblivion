import { Component } from '@angular/core';
import { ProductProductGroupsUpdateManager } from '../../classes/product-product-groups-update-manager';

@Component({
  selector: 'product-product-groups',
  templateUrl: './product-product-groups.component.html',
  styleUrls: ['./product-product-groups.component.scss']
})
export class ProductProductGroupsComponent extends ProductProductGroupsUpdateManager { }