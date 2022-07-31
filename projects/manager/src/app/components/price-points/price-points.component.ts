import { Component, ElementRef, Input, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { DataService, Image, LazyLoadingService, MediaType, PricePoint, RecurringPayment, Shipping, ShippingType, SpinnerAction } from 'common';
import { ImageSize, PopupArrowPosition } from '../../classes/enums';
import { Product } from '../../classes/product';
import { MediaBrowserComponent } from '../media-browser/media-browser.component';
import { RecurringPopupComponent } from '../recurring-popup/recurring-popup.component';
import { ShippingPopupComponent } from '../shipping-popup/shipping-popup.component';

@Component({
  selector: 'price-points',
  templateUrl: './price-points.component.html',
  styleUrls: ['./price-points.component.scss']
})
export class PricePointsComponent {
  // Private
  private shippingPopup!: ShippingPopupComponent;
  private recurringPopup!: RecurringPopupComponent;

  // Public
  public shipping = Shipping;
  public shippingType = ShippingType;
  public PopupArrowPosition = PopupArrowPosition;
  public recurringPayment = RecurringPayment;

  // Decorators
  @Input() product!: Product;
  @ViewChildren('header') header!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('addShippingPopup', { read: ViewContainerRef }) addShippingPopup!: QueryList<ViewContainerRef>;
  @ViewChildren('editShippingPopup', { read: ViewContainerRef }) editShippingPopup!: QueryList<ViewContainerRef>;
  @ViewChildren('addRecurringPopup', { read: ViewContainerRef }) addRecurringPopup!: QueryList<ViewContainerRef>;
  @ViewChildren('editRecurringPopup', { read: ViewContainerRef }) editRecurringPopup!: QueryList<ViewContainerRef>;

  // Constructor
  constructor(private lazyLoadingService: LazyLoadingService, private dataService: DataService) { }


  addPricePoint(pushNewPricePoint?: boolean) {
    if (pushNewPricePoint) this.product.pricePoints.push(new PricePoint());

    window.setTimeout(()=> {
      this.header.get(this.product.pricePoints.length - 1)?.nativeElement.focus();
    })
    
    
    this.dataService.post<number>('api/Products/PricePoint', {
      ProductId: this.product.id

    }).subscribe((pricePointId: number) => {
      this.product.pricePoints[this.product.pricePoints.length - 1].id = pricePointId;
    });
  }



  updatePricePoint(pricePoint: PricePoint) {
    this.dataService.put('api/Products/PricePoint', {
      id: pricePoint.id,
      header: pricePoint.header && pricePoint.header.length > 0 ? pricePoint.header : null,
      quantity: pricePoint.quantity && pricePoint.quantity.length > 0 ? pricePoint.quantity : null,
      imageId: pricePoint.image.id > 0 ? pricePoint.image.id : null,
      unitPrice: pricePoint.unitPrice && pricePoint.unitPrice.length > 0 ? pricePoint.unitPrice : null,
      unit: pricePoint.unit && pricePoint.unit.length > 0 ? pricePoint.unit : null,
      strikethroughPrice: pricePoint.strikethroughPrice && pricePoint.strikethroughPrice.length > 0 ? pricePoint.strikethroughPrice : null,
      price: pricePoint.price && pricePoint.price.length > 0 ? pricePoint.price : null,
      shippingType: pricePoint.shippingType,
      recurringPayment: pricePoint.recurringPayment
    }).subscribe();
  }



  deletePricePoint(pricePointIndex: number, pricePointId: number) {
    this.product.pricePoints.splice(pricePointIndex, 1)
    this.updateMinMaxPrice();

    this.dataService.delete('api/Products/PricePoint', {
      pricePointId: pricePointId
    }).subscribe();
  }


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




  onHeaderBlur(pricePoint: PricePoint, htmlElement: HTMLElement) {
    window.getSelection()!.removeAllRanges();

    if (!(pricePoint.header == null && htmlElement.innerText.length == 0) && pricePoint.header != htmlElement.innerText) {
      pricePoint.header = htmlElement.innerText;
      this.updatePricePoint(pricePoint);
    }
  }


  onHeaderEscape(pricePoint: PricePoint, htmlElement: HTMLElement) {
    htmlElement.innerText = pricePoint.header ? pricePoint.header : '';
    htmlElement.blur();
  }





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



  openMediaBrowser(pricePoint: PricePoint): void {
    this.lazyLoadingService.load(async () => {
      const { MediaBrowserComponent } = await import('../media-browser/media-browser.component');
      const { MediaBrowserModule } = await import('../media-browser/media-browser.module');
      return {
        component: MediaBrowserComponent,
        module: MediaBrowserModule
      }
    }, SpinnerAction.None)
      .then((mediaBrowser: MediaBrowserComponent) => {
        mediaBrowser.currentMediaType = MediaType.Image;
        mediaBrowser.imageSize = ImageSize.Small;

        mediaBrowser.callback = (image: Image) => {
          if (image) {

            pricePoint.image.id = image.id;
            pricePoint.image.name = image.name;
            pricePoint.image.src = image.src;
            pricePoint.image.thumbnail = image.thumbnail;

            this.updatePricePoint(pricePoint);
          }
        }
      });
  }



  onImageDelete(pricePoint: PricePoint) {
    // Delay just in case the image is being deleted by the [Enter] key.
    // If the deleting is NOT delayed, then Media Browser will think
    // no image is present and open
    window.setTimeout(() => {
      pricePoint.image = new Image();
      this.updatePricePoint(pricePoint);
    })
  }




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
      this.updateMinMaxPrice();
    }

    if (htmlElement.innerText.length > 0) this.isWholeNumber(htmlElement.innerText) ? this.convertToCurrency(htmlElement, 0) : this.convertToCurrency(htmlElement, 2);
  }



  onPriceEscape(pricePoint: PricePoint, htmlElement: HTMLElement) {
    htmlElement.innerText = pricePoint.price ? pricePoint.price : '';
    htmlElement.blur();
  }


  updateMinMaxPrice() {
    let minPrice: number = 0;
    let maxPrice: number = 0;


    if (this.product.pricePoints.length > 0) {
      minPrice = Math.min(...this.product.pricePoints.map(x => parseFloat(x.price ? x.price : '0')));
      maxPrice = Math.max(...this.product.pricePoints.map(x => parseFloat(x.price ? x.price : '0')));

      this.product.minPrice = minPrice;
      this.product.maxPrice = maxPrice == minPrice ? null! : maxPrice;

    } else {
      this.product.minPrice = minPrice;
      this.product.maxPrice = maxPrice;
    }


    this.dataService.put('api/Products/MinMaxPrice', {
      productId: this.product.id,
      minPrice: minPrice,
      maxPrice: maxPrice == minPrice ? 0 : maxPrice
    }).subscribe();
  }


  selectRange(htmlElement: HTMLElement) {
    window.setTimeout(() => {
      let range = document.createRange();
      range.selectNodeContents(htmlElement);
      let sel = window.getSelection();
      sel!.removeAllRanges();
      sel!.addRange(range);
    })
  }




  convertToCurrency(htmlElement: HTMLElement, minimumFractionDigits: number) {
    const numberFormat = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: minimumFractionDigits
    })

    htmlElement.innerText = numberFormat.format(parseFloat(htmlElement.innerText));
  }



  isWholeNumber(value: string): boolean {
    return parseFloat(value) % 1 == 0;
  }



  openShippingPopup(arrowPosition: PopupArrowPosition, pricePointIndex: number, pricePoint: PricePoint) {
    if (this.addShippingPopup.get(pricePointIndex)!.length > 0 || this.editShippingPopup.get(pricePointIndex)!.length > 0) {
      this.shippingPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { ShippingPopupComponent } = await import('../shipping-popup/shipping-popup.component');
      const { ShippingPopupModule } = await import('../shipping-popup/shipping-popup.module');
      return {
        component: ShippingPopupComponent,
        module: ShippingPopupModule
      }
    }, SpinnerAction.None, arrowPosition == PopupArrowPosition.BottomLeft ? this.addShippingPopup.get(pricePointIndex) : this.editShippingPopup.get(pricePointIndex))
      .then((shippingPopup: ShippingPopupComponent) => {
        this.shippingPopup = shippingPopup;
        shippingPopup.arrowPosition = arrowPosition;
        shippingPopup.shipping = arrowPosition == PopupArrowPosition.BottomLeft ? ShippingType.FreeShipping : pricePoint.shippingType;
        shippingPopup.callback = (shippingType: ShippingType) => {
          pricePoint.shippingType = shippingType;
          this.updatePricePoint(pricePoint);
        }
      });
  }





  openRecurringPopup(arrowPosition: PopupArrowPosition, pricePointIndex: number, pricePoint: PricePoint) {
    if (this.addRecurringPopup.get(pricePointIndex)!.length > 0 || this.editRecurringPopup.get(pricePointIndex)!.length > 0) {
      this.recurringPopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { RecurringPopupComponent } = await import('../recurring-popup/recurring-popup.component');
      const { RecurringPopupModule } = await import('../recurring-popup/recurring-popup.module');
      return {
        component: RecurringPopupComponent,
        module: RecurringPopupModule
      }

    }, SpinnerAction.None, arrowPosition == PopupArrowPosition.BottomLeft ? this.addRecurringPopup.get(pricePointIndex) : this.editRecurringPopup.get(pricePointIndex))
      .then((recurringPopup: RecurringPopupComponent) => {
        this.recurringPopup = recurringPopup;
        recurringPopup.arrowPosition = arrowPosition;

        if (pricePoint.recurringPayment) {
          recurringPopup.recurringPayment.recurringPrice = pricePoint.recurringPayment.recurringPrice;
          recurringPopup.recurringPayment.rebillFrequency = pricePoint.recurringPayment.rebillFrequency;
          recurringPopup.recurringPayment.subscriptionDuration = pricePoint.recurringPayment.subscriptionDuration;
          recurringPopup.recurringPayment.timeFrameBetweenRebill = pricePoint.recurringPayment.timeFrameBetweenRebill;
          recurringPopup.recurringPayment.trialPeriod = pricePoint.recurringPayment.trialPeriod;
        }

        recurringPopup.callback = (recurringPayment: RecurringPayment) => {
          pricePoint.recurringPayment = recurringPayment;

          if (pricePoint.recurringPayment.recurringPrice == 0) {
            this.removeRecurringPayment(pricePoint);
          } else {
            this.updatePricePoint(pricePoint);
          }
        }
      });
  }


  removeRecurringPayment(pricePoint: PricePoint) {
    pricePoint.recurringPayment.rebillFrequency = 0;
    pricePoint.recurringPayment.recurringPrice = 0;
    pricePoint.recurringPayment.subscriptionDuration = 0;
    pricePoint.recurringPayment.timeFrameBetweenRebill = 0;
    pricePoint.recurringPayment.trialPeriod = 0;
    this.updatePricePoint(pricePoint);
  }
}