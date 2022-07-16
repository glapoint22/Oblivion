import { Component, Input } from '@angular/core';
import { Shipping, ShippingType } from 'common';

@Component({
  selector: 'shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent {
  @Input() shippingType!: ShippingType;
  public Shipping = Shipping;
}