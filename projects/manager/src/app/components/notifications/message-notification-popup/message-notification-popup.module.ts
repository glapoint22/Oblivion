import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageNotificationPopupComponent } from './message-notification-popup.component';
import { CounterModule } from '../../counter/counter.module';
import { FormsModule } from '@angular/forms';
import { IconButtonModule } from '../../icon-button/icon-button.module';



@NgModule({
  declarations: [MessageNotificationPopupComponent],
  imports: [
    CommonModule,
    CounterModule,
    FormsModule,
    IconButtonModule
  ]
})
export class MessageNotificationPopupModule { }