import { Component, Input } from '@angular/core';
import { PricePoint } from 'common';
import { PricePointComponent } from '../price-point.component';

@Component({
  selector: 'price-point-unit-price',
  templateUrl: './price-point-unit-price.component.html',
  styleUrls: ['../../price-point/price-point.component.scss', './price-point-unit-price.component.scss']
})
export class PricePointUnitPriceComponent extends PricePointComponent {
  @Input() pricePoint!: PricePoint;
  
  onUnitPriceFocus(htmlElement: HTMLElement) {
    this.selectRange(htmlElement);

    if (htmlElement.innerText.length > 0) {
      htmlElement.innerText = htmlElement.innerText.substring(1);
    }
  }


  onUnitPriceInput(htmlElement: HTMLElement) {
    !(/^[0-9.]*$/i).test(htmlElement.innerText) ? htmlElement.innerText = htmlElement.innerText.replace(/[^0-9.]/ig, '') : null;
  }


  onUnitPriceBlur(pricePoint: PricePoint, htmlElement: HTMLElement) {
    window.getSelection()!.removeAllRanges();

    if (!(pricePoint.unitPrice == null && htmlElement.innerText.length == 0) && pricePoint.unitPrice != htmlElement.innerText) {
      pricePoint.unitPrice = htmlElement.innerText;
      this.updatePricePoint(pricePoint);
    }

    if (htmlElement.innerText.length > 0) this.isWholeNumber(htmlElement.innerText) ? this.convertToCurrency(htmlElement, 0) : this.convertToCurrency(htmlElement, 2);
  }


  onUnitPriceEscape(pricePoint: PricePoint, htmlElement: HTMLElement) {
    htmlElement.innerText = pricePoint.unitPrice ? pricePoint.unitPrice : '';
    htmlElement.blur();
  }
}