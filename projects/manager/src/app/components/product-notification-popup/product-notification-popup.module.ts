import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductNotificationPopupComponent } from './product-notification-popup.component';



@NgModule({
  declarations: [ProductNotificationPopupComponent],
  imports: [
    CommonModule
  ],
  exports: [ProductNotificationPopupComponent]
})
export class ProductNotificationPopupModule { }