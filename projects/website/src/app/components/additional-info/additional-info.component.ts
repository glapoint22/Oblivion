import { Component, Input } from '@angular/core';
import { ShippingType, AdditionalInfo, RecurringPayment, Shipping } from 'common';

@Component({
  selector: 'additional-info',
  templateUrl: './additional-info.component.html',
  styleUrls: ['./additional-info.component.scss']
})
export class AdditionalInfoComponent {
  @Input() additionalInfo!: Array<AdditionalInfo>;
  public shippingType = ShippingType;
  public recurringPayment = RecurringPayment;
  public shipping = Shipping;
}