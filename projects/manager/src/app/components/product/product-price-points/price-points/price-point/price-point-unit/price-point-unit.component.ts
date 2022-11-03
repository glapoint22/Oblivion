import { Component } from '@angular/core';
import { PricePointComponent } from '../price-point.component';

@Component({
  selector: 'price-point-unit',
  templateUrl: './price-point-unit.component.html',
  styleUrls: ['../../price-point/price-point.component.scss', './price-point-unit.component.scss']
})
export class PricePointUnitComponent extends PricePointComponent { }