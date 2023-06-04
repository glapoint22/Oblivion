import { Component, Input } from '@angular/core';
import { RecurringPayment } from '../../classes/recurring-payment';

@Component({
  selector: 'recurring-payment',
  templateUrl: './recurring-payment.component.html',
  styleUrls: ['./recurring-payment.component.scss']
})
export class RecurringPaymentComponent {
  @Input() recurringPayment!: RecurringPayment;
  @Input() currency!: string;
  public RecurringPayment = RecurringPayment;
}