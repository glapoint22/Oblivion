import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PricePointComponent } from '../price-point.component';

@Component({
  selector: 'price-point-price',
  templateUrl: './price-point-price.component.html',
  styleUrls: ['../../price-point/price-point.component.scss', './price-point-price.component.scss']
})
export class PricePointPriceComponent extends PricePointComponent {
  @Input() currency!: string;
  @Output() onUpdateMinMaxPrice: EventEmitter<void> = new EventEmitter();
}