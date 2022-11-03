import { Component } from '@angular/core';
import { PricePointComponent } from '../price-point.component';

@Component({
  selector: 'price-point-quantity',
  templateUrl: './price-point-quantity.component.html',
  styleUrls: ['../../price-point/price-point.component.scss', './price-point-quantity.component.scss']
})
export class PricePointQuantityComponent extends PricePointComponent { }