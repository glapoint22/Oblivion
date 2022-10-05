import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAccountNotificationPopupComponent } from './user-account-notification-popup.component';
import { FormsModule } from '@angular/forms';
import { CounterModule } from '../../counter/counter.module';
import { IconButtonModule } from '../../icon-button/icon-button.module';



@NgModule({
  declarations: [UserAccountNotificationPopupComponent],
  imports: [
    CommonModule,
    IconButtonModule,
    CounterModule,
    FormsModule
  ]
})
export class UserAccountNotificationPopupModule { }