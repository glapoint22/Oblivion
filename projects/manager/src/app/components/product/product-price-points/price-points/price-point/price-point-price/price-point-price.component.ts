import { Component, EventEmitter, Output } from '@angular/core';
import { PricePointComponent } from '../price-point.component';

@Component({
  selector: 'price-point-price',
  templateUrl: './price-point-price.component.html',
  styleUrls: ['../../price-point/price-point.component.scss', './price-point-price.component.scss']
})
export class PricePointPriceComponent extends PricePointComponent {
  @Output() onUpdateMinMaxPrice: EventEmitter<void> = new EventEmitter();
}