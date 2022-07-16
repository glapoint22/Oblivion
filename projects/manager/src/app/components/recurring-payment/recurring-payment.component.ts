import { Component, Input } from '@angular/core';
import { RecurringPayment } from 'common';

@Component({
  selector: 'recurring-payment',
  templateUrl: './recurring-payment.component.html',
  styleUrls: ['./recurring-payment.component.scss']
})
export class RecurringPaymentComponent {
  @Input() recurringPayment!: RecurringPayment;
  public RecurringPayment = RecurringPayment;
}