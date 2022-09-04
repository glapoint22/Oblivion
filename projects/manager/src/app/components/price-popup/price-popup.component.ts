import { Component, ElementRef, ViewChild } from '@angular/core';
import { LazyLoad } from 'common';

@Component({
  selector: 'price-popup',
  templateUrl: './price-popup.component.html',
  styleUrls: ['./price-popup.component.scss']
})
export class PricePopupComponent extends LazyLoad {
  @ViewChild('priceInput') priceInput!: ElementRef<HTMLInputElement>;
  public price!: number;
  public callback!: Function;
  public top!: number;
  public left!: number;
  

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
  }
}