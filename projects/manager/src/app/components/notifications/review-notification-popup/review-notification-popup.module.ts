import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterModule } from '../../counter/counter.module';
import { ReviewNotificationPopupComponent } from './review-notification-popup.component';
import { IconButtonModule } from '../../icon-button/icon-button.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ReviewNotificationPopupComponent],
  imports: [
    CommonModule,
    CounterModule,
    IconButtonModule,
    FormsModule
  ],
  exports: [ReviewNotificationPopupComponent]
})
export class ReviewNotificationPopupModule { }