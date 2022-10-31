import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PricePoint } from 'common';
import { PricePointComponent } from '../price-point.component';

@Component({
  selector: 'price-point-price',
  templateUrl: './price-point-price.component.html',
  styleUrls: ['../../price-point/price-point.component.scss', './price-point-price.component.scss']
})
export class PricePointPriceComponent extends PricePointComponent {
  @Input() pricePoint!: PricePoint;
  @Output() onUpdateMinMaxPrice: EventEmitter<void> = new EventEmitter();
  
  onPriceFocus(htmlElement: HTMLElement) {
    this.selectRange(htmlElement);

    if (htmlElement.innerText.length > 0) {
      htmlElement.innerText = htmlElement.innerText.substring(1);
    }
  }


  onPriceInput(htmlElement: HTMLElement) {
    !(/^[0-9.]*$/i).test(htmlElement.innerText) ? htmlElement.innerText = htmlElement.innerText.replace(/[^0-9.]/ig, '') : null;
  }


  onPriceBlur(pricePoint: PricePoint, htmlElement: HTMLElement) {
    window.getSelection()!.removeAllRanges();

    if (!(pricePoint.price == null && htmlElement.innerText.length == 0) && pricePoint.price != htmlElement.innerText) {
      pricePoint.price = htmlElement.innerText;
      this.updatePricePoint(pricePoint);
      // this.updateMinMaxPrice();
      this.onUpdateMinMaxPrice.emit();
      
    }

    if (htmlElement.innerText.length > 0) this.isWholeNumber(htmlElement.innerText) ? this.convertToCurrency(htmlElement, 0) : this.convertToCurrency(htmlElement, 2);
  }



  onPriceEscape(pricePoint: PricePoint, htmlElement: HTMLElement) {
    htmlElement.innerText = pricePoint.price ? pricePoint.price : '';
    htmlElement.blur();
  }
}