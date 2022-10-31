import { Component, Input } from '@angular/core';
import { PricePoint } from 'common';
import { PricePointComponent } from '../price-point.component';

@Component({
  selector: 'price-point-strikethrough-price',
  templateUrl: './price-point-strikethrough-price.component.html',
  styleUrls: ['../../price-point/price-point.component.scss', './price-point-strikethrough-price.component.scss']
})
export class PricePointStrikethroughPriceComponent extends PricePointComponent {
  @Input() pricePoint!: PricePoint;
 
  onStrikethroughPriceFocus(htmlElement: HTMLElement) {
    this.selectRange(htmlElement);

    if (htmlElement.innerText.length > 0) {
      htmlElement.innerText = htmlElement.innerText.substring(1);
    }
  }


  onStrikethroughPriceInput(htmlElement: HTMLElement) {
    !(/^[0-9.]*$/i).test(htmlElement.innerText) ? htmlElement.innerText = htmlElement.innerText.replace(/[^0-9.]/ig, '') : null;
  }


  onStrikethroughPriceBlur(pricePoint: PricePoint, htmlElement: HTMLElement) {
    window.getSelection()!.removeAllRanges();

    if (!(pricePoint.strikethroughPrice == null && htmlElement.innerText.length == 0) && pricePoint.strikethroughPrice != htmlElement.innerText) {
      pricePoint.strikethroughPrice = htmlElement.innerText;
      this.updatePricePoint(pricePoint);
    }

    if (htmlElement.innerText.length > 0) this.isWholeNumber(htmlElement.innerText) ? this.convertToCurrency(htmlElement, 0) : this.convertToCurrency(htmlElement, 2);
  }



  onStrikethroughPriceEscape(pricePoint: PricePoint, htmlElement: HTMLElement) {
    htmlElement.innerText = pricePoint.strikethroughPrice ? pricePoint.strikethroughPrice : '';
    htmlElement.blur();
  }
}
