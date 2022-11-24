import { Component, ElementRef, ViewChild } from '@angular/core';
import { LazyLoad } from 'common';
import { Subject } from 'rxjs';
import { PopupArrowPosition } from '../../classes/enums';

@Component({
  selector: 'price-popup',
  templateUrl: './price-popup.component.html',
  styleUrls: ['./price-popup.component.scss']
})
export class PricePopupComponent extends LazyLoad {
  @ViewChild('priceInput') priceInput!: ElementRef<HTMLInputElement>;
  public arrowPosition!: PopupArrowPosition;
  public PopupArrowPosition = PopupArrowPosition;
  public price!: number;
  public callback!: Function;
  public top!: number;
  public left!: number;
  public onClose: Subject<void> = new Subject<void>();
  public submitButtonDisabled: boolean = true;
  

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    if(this.price) this.priceInput.nativeElement.value = this.price.toFixed(2);
    window.addEventListener('mousedown', this.mousedown);
    this.setFocus(0);
  }


  mousedown = () => {
    this.close();
  }



  onInput() {
    !(/^[0-9.]*$/i).test(this.priceInput.nativeElement.value) ? this.priceInput.nativeElement.value = this.priceInput.nativeElement.value.replace(/[^0-9.]/ig, '') : null;

    // Disable the submit button if:
    this.submitButtonDisabled = 
    // the price in the input field is (NOT) different than the initial price
    !(parseFloat(this.priceInput.nativeElement.value) != this.price &&
    // the input field is empty
    this.priceInput.nativeElement.value.length > 0 &&
    // or the value in the input field is (NOT) a number
    !isNaN(parseFloat(this.priceInput.nativeElement.value)));
  }


  onSubmitClick() {
    this.price = parseFloat(this.priceInput.nativeElement.value);
    this.callback(this.price);
    this.close();
  }


  close(): void {
    super.close();
    this.onClose.next();
  }


  ngOnDestroy() {
    super.ngOnDestroy();
    window.removeEventListener('mousedown', this.mousedown);
  }
}