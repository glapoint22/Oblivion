import { Component } from '@angular/core';
import { PricePointComponent } from '../price-point.component';

@Component({
  selector: 'price-point-subheader',
  templateUrl: './price-point-subheader.component.html',
  styleUrls: ['../../price-point/price-point.component.scss', './price-point-subheader.component.scss']
})
export class PricePointSubheaderComponent extends PricePointComponent { }