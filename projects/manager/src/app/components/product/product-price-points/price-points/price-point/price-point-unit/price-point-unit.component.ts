import { Component, Input } from '@angular/core';
import { PricePoint } from 'common';
import { PricePointComponent } from '../price-point.component';

@Component({
  selector: 'price-point-unit',
  templateUrl: './price-point-unit.component.html',
  styleUrls: ['../../price-point/price-point.component.scss', './price-point-unit.component.scss']
})
export class PricePointUnitComponent extends PricePointComponent {
  @Input() pricePoint!: PricePoint;
 
  onUnitBlur(pricePoint: PricePoint, htmlElement: HTMLElement) {
    window.getSelection()!.removeAllRanges();

    if (!(pricePoint.unit == null && htmlElement.innerText.length == 0) && pricePoint.unit != htmlElement.innerText) {
      pricePoint.unit = htmlElement.innerText;
      this.updatePricePoint(pricePoint);
    }
  }



  onUnitEscape(pricePoint: PricePoint, htmlElement: HTMLElement) {
    htmlElement.innerText = pricePoint.unit ? pricePoint.unit : '';
    htmlElement.blur();
  }
}