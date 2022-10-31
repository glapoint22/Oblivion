import { Component, Input } from '@angular/core';
import { PricePoint } from 'common';
import { PricePointComponent } from '../price-point.component';

@Component({
  selector: 'price-point-quantity',
  templateUrl: './price-point-quantity.component.html',
  styleUrls: ['../../price-point/price-point.component.scss', './price-point-quantity.component.scss']
})
export class PricePointQuantityComponent extends PricePointComponent {
  @Input() pricePoint!: PricePoint;

  onQuantityBlur(pricePoint: PricePoint, htmlElement: HTMLElement) {
    window.getSelection()!.removeAllRanges();

    if (!(pricePoint.quantity == null && htmlElement.innerText.length == 0) && pricePoint.quantity != htmlElement.innerText) {
      pricePoint.quantity = htmlElement.innerText;
      this.updatePricePoint(pricePoint);
    }
  }


  onQuantityEscape(pricePoint: PricePoint, htmlElement: HTMLElement) {
    htmlElement.innerText = pricePoint.quantity ? pricePoint.quantity : '';
    htmlElement.blur();
  }
}