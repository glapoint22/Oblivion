import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService } from 'common';

@Component({
  selector: 'price-popup',
  templateUrl: './price-popup.component.html',
  styleUrls: ['./price-popup.component.scss']
})
export class PricePopupComponent extends LazyLoad {
  @ViewChild('priceInput') priceInput!: ElementRef<HTMLInputElement>;
  public price!: number;
  public productId!: number;
  public callback!: Function;

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) {
    super(lazyLoadingService);
  }


  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.priceInput.nativeElement.value = this.price.toFixed(2);

    window.setTimeout(() => {
      this.priceInput.nativeElement.focus();
      this.priceInput.nativeElement.select();
    });
  }

  onInput() {
    !(/^[0-9.]*$/i).test(this.priceInput.nativeElement.value) ? this.priceInput.nativeElement.value = this.priceInput.nativeElement.value.replace(/[^0-9.]/ig, '') : null;

    if (this.priceInput.nativeElement.value) {
      this.price = parseFloat(this.priceInput.nativeElement.value);

      if (isNaN(this.price)) {
        this.price = 0;
      }

    } else {
      this.price = 0;
      window.setTimeout(() => {
        this.priceInput.nativeElement.value = '';
      });
    }
  }


  onSubmitClick() {
    this.callback(this.price);
    this.close();

    this.dataService.put('api/Products/MinMaxPrice', {
      productId: this.productId,
      minPrice: this.price,
      maxPrice: 0
    }).subscribe();
  }
}