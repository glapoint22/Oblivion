import { Component } from '@angular/core';
import { LazyLoad, ShippingType } from 'common';

@Component({
  selector: 'shipping-popup',
  templateUrl: './shipping-popup.component.html',
  styleUrls: ['./shipping-popup.component.scss']
})
export class ShippingPopupComponent extends LazyLoad {
  public isAdd!: boolean;
  public shipping!: ShippingType;
  public shippingType = ShippingType;
  public callback!: Function;

  onSubmitClick() {
    this.callback(this.shipping);
    this.close();
  }
}