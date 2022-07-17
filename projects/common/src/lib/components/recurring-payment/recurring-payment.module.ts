import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecurringPaymentComponent } from './recurring-payment.component';



@NgModule({
  declarations: [RecurringPaymentComponent],
  imports: [
    CommonModule
  ],
  exports: [RecurringPaymentComponent]
})
export class RecurringPaymentModule { }
