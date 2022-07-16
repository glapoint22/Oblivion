import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { DataService, Image, LazyLoadingService, MediaType, PricePoint, RecurringPayment, Shipping, SpinnerAction } from 'common';
import { max } from 'rxjs';
import { MediaBrowserComponent } from '../media-browser/media-browser.component';
import { RecurringPopupComponent } from '../recurring-popup/recurring-popup.component';

@Component({
  selector: 'price-points',
  templateUrl: './price-points.component.html',
  styleUrls: ['./price-points.component.scss']
})
export class PricePointsComponent {
  public window = window;
  public shipping = Shipping;
  public recurringPayment = RecurringPayment;
  @Input() pricePoints!: Array<PricePoint>;
  @Input() productId!: number;
  @Output() minPrice: EventEmitter<number> = new EventEmitter();
  @Output() maxPrice: EventEmitter<number> = new EventEmitter();
  // @ViewChild('addRecurringPopup', { read: ViewContainerRef }) addRecurringPopup!: ViewContainerRef;
  @ViewChild('editRecurringPopup', { read: ViewContainerRef }) editRecurringPopup!: ViewContainerRef;


  @ViewChildren('addRecurringPopup', { read: ViewContainerRef }) addRecurringPopup!: QueryList<ViewContainerRef>;


  constructor(private lazyLoadingService: LazyLoadingService, private dataService: DataService) { }






  addPricePoint(pushNewPricePoint?: boolean) {
    if (pushNewPricePoint) this.pricePoints.push(new PricePoint());

    // this.dataService.post<number>('api/Products/Price', {
    //   ProductId: this.productId
    // }).subscribe((pricePointId: number) => {

    //   this.pricePoints[this.pricePoints.length - 1].id = pricePointId;
    // });
  }



  updatePricePoint(pricePoint: PricePoint) {
    // this.dataService.put('api/Products/Price', {
    //   productId: this.productId,
    //   id: pricePoint.id,
    //   header: pricePoint.header,
    //   quantity: pricePoint.quantity,
    //   imageId: pricePoint.image ? pricePoint.image.id > 0 ? pricePoint.image.id : null : null,
    //   unitPrice: pricePoint.unitPrice,
    //   unit: pricePoint.unit,
    //   strikethroughPrice: pricePoint.strikethroughPrice,
    //   price: parseFloat(pricePoint.price)
    // }).subscribe();
  }



  deletePricePoint(index: number) {
    this.pricePoints.splice(index, 1)
    this.updateMinMaxPrice();
  }


  onHeaderBlur(pricePoint: PricePoint, value: string) {
    pricePoint.header = value;
    this.updatePricePoint(pricePoint);
  }


  onQuantityBlur(pricePoint: PricePoint, value: string) {
    pricePoint.quantity = value;
    this.updatePricePoint(pricePoint);
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


        mediaBrowser.callback = (image: Image) => {
          if (image) {

            if (!pricePoint.image) pricePoint.image = new Image();
            pricePoint.image.id = image.id;
            pricePoint.image.name = image.name;
            pricePoint.image.src = image.src;
            pricePoint.image.thumbnail = image.thumbnail;
            this.updatePricePoint(pricePoint);
          }
        }
      });
  }


  onUnitPriceFocus(htmlElement: HTMLElement) {
    if (htmlElement.innerText.length > 0) {
      htmlElement.innerText = htmlElement.innerText.substring(1);
    }
  }


  onUnitPriceBlur(pricePoint: PricePoint, htmlElement: HTMLElement) {
    pricePoint.unitPrice = htmlElement.innerText;
    this.updatePricePoint(pricePoint);
    if (htmlElement.innerText.length > 0) this.convertToCurrency(htmlElement);
  }


  onUnitBlur(pricePoint: PricePoint, value: string) {
    pricePoint.unit = value;
    this.updatePricePoint(pricePoint);
  }



  onStrikethroughPriceFocus(htmlElement: HTMLElement) {
    if (htmlElement.innerText.length > 0) {
      htmlElement.innerText = htmlElement.innerText.substring(1);
    }
  }


  onStrikethroughPriceBlur(pricePoint: PricePoint, htmlElement: HTMLElement) {
    pricePoint.strikethroughPrice = htmlElement.innerText;
    this.updatePricePoint(pricePoint);
    if (htmlElement.innerText.length > 0) this.convertToCurrency(htmlElement);
  }


  onPriceFocus(htmlElement: HTMLElement) {
    if (htmlElement.innerText.length > 0) {
      htmlElement.innerText = htmlElement.innerText.substring(1);
    }
  }


  onPriceBlur(pricePoint: PricePoint, htmlElement: HTMLElement) {
    pricePoint.price = htmlElement.innerText;
    this.updatePricePoint(pricePoint);
    this.updateMinMaxPrice();
    if (htmlElement.innerText.length > 0) this.convertToCurrency(htmlElement);
  }


  updateMinMaxPrice() {
    let minPrice: number = 0;
    let maxPrice: number = 0;


    if (this.pricePoints.length > 0) {
      minPrice = Math.min(...this.pricePoints.map(x => parseFloat(x.price ? x.price : '0')));
      maxPrice = Math.max(...this.pricePoints.map(x => parseFloat(x.price ? x.price : '0')));

      this.minPrice.emit(minPrice);
      this.maxPrice.emit(maxPrice == minPrice ? null! : maxPrice);

    } else {
      this.minPrice.emit(minPrice);
      this.maxPrice.emit(maxPrice);
    }


    // this.dataService.put('api/Products/MinMaxPrice', {
    //   productId: this.productId,
    //   minPrice: minPrice,
    //   maxPrice: maxPrice == minPrice ? 0 : maxPrice
    // }).subscribe();
  }


  convertToCurrency(htmlElement: HTMLElement) {
    const numberFormat = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    })

    htmlElement.innerText = numberFormat.format(parseFloat(htmlElement.innerText));
  }





  openRecurringPopup(add: boolean, index: number, container: HTMLElement, button: HTMLElement, overflow: HTMLElement) {
    // if (this.addRecurringPopup.length > 0 || this.editRecurringPopup.length > 0) return;

    if (this.addRecurringPopup.get(index)!.length > 0) return;

    container.style.top = button.getBoundingClientRect().top - 329 - overflow.getBoundingClientRect().top + 'px';

    

    this.lazyLoadingService.load(async () => {
      const { RecurringPopupComponent } = await import('../recurring-popup/recurring-popup.component');
      const { RecurringPopupModule } = await import('../recurring-popup/recurring-popup.module');
      return {
        component: RecurringPopupComponent,
        module: RecurringPopupModule
      }
    }, SpinnerAction.None, this.addRecurringPopup.get(index))
      .then((recurringPopup: RecurringPopupComponent) => {
        recurringPopup.isAdd = add;

        // if (this.product.recurringPayment) {
        //   recurringPopup.recurringPayment.price = this.product.recurringPayment.price;
        //   recurringPopup.recurringPayment.rebillFrequency = this.product.recurringPayment.rebillFrequency;
        //   recurringPopup.recurringPayment.subscriptionDuration = this.product.recurringPayment.subscriptionDuration;
        //   recurringPopup.recurringPayment.timeFrameBetweenRebill = this.product.recurringPayment.timeFrameBetweenRebill;
        //   recurringPopup.recurringPayment.trialPeriod = this.product.recurringPayment.trialPeriod;
        // }

        recurringPopup.callback = (recurringPayment: RecurringPayment) => {
          // this.product.recurringPayment = recurringPayment;
          // console.log(recurringPayment)
        }
      });
  }
}