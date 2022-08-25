import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageNotificationPopupComponent } from './message-notification-popup.component';



@NgModule({
  declarations: [MessageNotificationPopupComponent],
  imports: [
    CommonModule
  ],
  exports: [MessageNotificationPopupComponent]
})
export class MessageNotificationPopupModule { }