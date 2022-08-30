import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewComplaintNotificationPopupComponent } from './review-complaint-notification-popup.component';
import { CounterModule } from '../counter/counter.module';



@NgModule({
  declarations: [ReviewComplaintNotificationPopupComponent],
  imports: [
    CommonModule,
    CounterModule
  ],
  exports: [ReviewComplaintNotificationPopupComponent]
})
export class ReviewComplaintNotificationPopupModule { }