import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductNotificationPopupComponent } from './product-notification-popup.component';
import { CounterModule } from '../../counter/counter.module';
import { IconButtonModule } from '../../icon-button/icon-button.module';
import { DropdownModule } from '../../dropdown/dropdown.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ProductNotificationPopupComponent],
  imports: [
    CommonModule,
    CounterModule,
    IconButtonModule,
    DropdownModule,
    FormsModule
  ]
})
export class ProductNotificationPopupModule { }