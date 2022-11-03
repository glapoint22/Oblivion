import { Component } from '@angular/core';
import { PricePointComponent } from '../price-point.component';

@Component({
  selector: 'price-point-strikethrough-price',
  templateUrl: './price-point-strikethrough-price.component.html',
  styleUrls: ['../../price-point/price-point.component.scss', './price-point-strikethrough-price.component.scss']
})
export class PricePointStrikethroughPriceComponent extends PricePointComponent { }