import { Component, Input } from '@angular/core';
import { DataService, LazyLoadingService, PricePoint } from 'common';
import { PopupArrowPosition } from 'projects/manager/src/app/classes/enums';
import { ProductService } from 'projects/manager/src/app/services/product/product.service';

@Component({
  template: '',
  styleUrls: ['./price-point.component.scss']
})
export class PricePointComponent {
  public PopupArrowPosition = PopupArrowPosition;
  @Input() pricePoint!: PricePoint;

  constructor(public dataService: DataService, public lazyLoadingService: LazyLoadingService, private productService: ProductService) { }


  // =====================================================================( ON FOCUS )====================================================================== \\

  onFocus(htmlElement: HTMLElement) {
    this.selectRange(htmlElement);

    if (htmlElement.innerText.length > 0) {
      htmlElement.innerText = htmlElement.innerText.substring(1);
    }
  }



  // =====================================================================( ON PASTE )====================================================================== \\

  onPaste(e: ClipboardEvent, htmlElement: HTMLElement, isPrice?: boolean) {
    e.preventDefault();
    const clipboardData = e.clipboardData!.getData('text/plain');
    if (clipboardData) {
      htmlElement.innerText = clipboardData;
    }

    if (isPrice) !(/^[0-9.]*$/i).test(htmlElement.innerText) ? htmlElement.innerText = htmlElement.innerText.replace(/[^0-9.]/ig, '') : null;

    // Place cursor at the end of the text
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(htmlElement);
    range.collapse(false);
    sel!.removeAllRanges();
    sel!.addRange(range);
  }



  // ===================================================================( SELECT RANGE )==================================================================== \\

  selectRange(htmlElement: HTMLElement) {
    window.setTimeout(() => {
      let range = document.createRange();
      range.selectNodeContents(htmlElement);
      let sel = window.getSelection();
      sel!.removeAllRanges();
      sel!.addRange(range);
    })
  }



  // =====================================================================( ON INPUT )====================================================================== \\

  onInput(htmlElement: HTMLElement) {
    !(/^[0-9.]*$/i).test(htmlElement.innerText) ? htmlElement.innerText = htmlElement.innerText.replace(/[^0-9.]/ig, '') : null;
  }



  // ======================================================================( ON BLUR )====================================================================== \\

  onBlur(pricePoint: PricePoint, property: keyof PricePoint, htmlElement: HTMLElement, isPrice?: boolean) {
    window.getSelection()!.removeAllRanges();

    if (!(pricePoint[property] == null && htmlElement.innerText.length == 0) && pricePoint[property] != htmlElement.innerText) {
      (pricePoint[property] as string) = htmlElement.innerText;
      this.updatePricePoint(pricePoint);
    }

    if (isPrice && htmlElement.innerText.length > 0) this.isWholeNumber(htmlElement.innerText) ? this.convertToCurrency(htmlElement, 0) : this.convertToCurrency(htmlElement, 2);
  }


  // =================================================================( IS WHOLE NUMBER )=================================================================== \\

  isWholeNumber(value: string): boolean {
    return parseFloat(value) % 1 == 0;
  }



  // ===============================================================( CONVERT TO CURRENCY )================================================================= \\

  convertToCurrency(htmlElement: HTMLElement, minimumFractionDigits: number) {
    const numberFormat = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: minimumFractionDigits
    })

    htmlElement.innerText = numberFormat.format(parseFloat(htmlElement.innerText));
  }



  // =====================================================================( ON ESCAPE )===================================================================== \\

  onEscape(pricePoint: PricePoint, property: keyof PricePoint, htmlElement: HTMLElement) {
    htmlElement.innerText = pricePoint[property] ? (pricePoint[property] as string) : '';
    htmlElement.blur();
  }



  // ================================================================( UPDATE PRICE POINT )================================================================= \\

  updatePricePoint(pricePoint: PricePoint) {
    this.dataService.put('api/Products/PricePoint', {
      productId: this.productService.selectedProduct.product.id,
      pricePoint: {
        id: pricePoint.id,
        header: pricePoint.header && pricePoint.header.length > 0 ? pricePoint.header : null,
        quantity: pricePoint.quantity && pricePoint.quantity.length > 0 ? pricePoint.quantity : null,
        imageId: pricePoint.image.id ? pricePoint.image.id : null,
        unitPrice: pricePoint.unitPrice && pricePoint.unitPrice.length > 0 ? pricePoint.unitPrice : null,
        unit: pricePoint.unit && pricePoint.unit.length > 0 ? pricePoint.unit : null,
        strikethroughPrice: pricePoint.strikethroughPrice && pricePoint.strikethroughPrice.length > 0 ? pricePoint.strikethroughPrice : null,
        shippingType: pricePoint.shippingType,
        price: pricePoint.price,
        recurringPayment: pricePoint.recurringPayment
      }
    }, {
      authorization: true
    }).subscribe();
  }
}