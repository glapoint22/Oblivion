import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductNotificationPopupComponent } from './product-notification-popup.component';
import { CounterModule } from '../counter/counter.module';



@NgModule({
  declarations: [ProductNotificationPopupComponent],
  imports: [
    CommonModule,
    CounterModule
  ],
  exports: [ProductNotificationPopupComponent]
})
export class ProductNotificationPopupModule { }