import { Component, Input } from '@angular/core';
import { PricePoint } from '../../classes/price-point';

@Component({
  selector: 'price-points',
  templateUrl: './price-points.component.html',
  styleUrls: ['./price-points.component.scss']
})
export class PricePointsComponent {
  @Input() pricePoints!: Array<PricePoint>;
}