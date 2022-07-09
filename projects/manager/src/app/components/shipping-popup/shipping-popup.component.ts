import { Component } from '@angular/core';
import { LazyLoad } from 'common';

@Component({
  selector: 'shipping-popup',
  templateUrl: './shipping-popup.component.html',
  styleUrls: ['./shipping-popup.component.scss']
})
export class ShippingPopupComponent extends LazyLoad {
  public isAdd!: boolean;
}