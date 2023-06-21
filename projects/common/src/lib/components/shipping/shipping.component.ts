import { Component, Input } from '@angular/core';
import { ShippingType } from '../../classes/enums';
import { Shipping } from '../../classes/shipping';

@Component({
  selector: 'shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent {
  @Input() shippingType!: ShippingType;
  @Input() shippingValue!: string;
  public Shipping = Shipping;
}