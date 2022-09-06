import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageNotificationPopupComponent } from './message-notification-popup.component';
import { CounterModule } from '../counter/counter.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [MessageNotificationPopupComponent],
  imports: [
    CommonModule,
    CounterModule,
    FormsModule
  ],
  exports: [MessageNotificationPopupComponent]
})
export class MessageNotificationPopupModule { }