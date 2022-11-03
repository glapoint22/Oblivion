import { Component } from '@angular/core';
import { PricePointComponent } from '../price-point.component';

@Component({
  selector: 'price-point-unit-price',
  templateUrl: './price-point-unit-price.component.html',
  styleUrls: ['../../price-point/price-point.component.scss', './price-point-unit-price.component.scss']
})
export class PricePointUnitPriceComponent extends PricePointComponent { }