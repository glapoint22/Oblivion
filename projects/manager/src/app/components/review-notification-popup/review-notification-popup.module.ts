import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterModule } from '../counter/counter.module';
import { ReviewNotificationPopupComponent } from './review-notification-popup.component';



@NgModule({
  declarations: [ReviewNotificationPopupComponent],
  imports: [
    CommonModule,
    CounterModule
  ],
  exports: [ReviewNotificationPopupComponent]
})
export class ReviewNotificationPopupModule { }