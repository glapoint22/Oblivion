import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterModule } from '../../counter/counter.module';
import { ReviewComplaintNotificationPopupComponent } from './review-complaint-notification-popup.component';
import { IconButtonModule } from '../../icon-button/icon-button.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ReviewComplaintNotificationPopupComponent],
  imports: [
    CommonModule,
    CounterModule,
    IconButtonModule,
    FormsModule
  ]
})
export class ReviewComplaintNotificationPopupModule { }