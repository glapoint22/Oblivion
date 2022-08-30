import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageNotificationPopupComponent } from './message-notification-popup.component';
import { CounterModule } from '../counter/counter.module';



@NgModule({
  declarations: [MessageNotificationPopupComponent],
  imports: [
    CommonModule,
    CounterModule
  ],
  exports: [MessageNotificationPopupComponent]
})
export class MessageNotificationPopupModule { }