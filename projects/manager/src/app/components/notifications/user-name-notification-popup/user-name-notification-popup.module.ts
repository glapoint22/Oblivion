import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserNameNotificationPopupComponent } from './user-name-notification-popup.component';
import { FormsModule } from '@angular/forms';
import { CounterModule } from '../../counter/counter.module';
import { IconButtonModule } from '../../icon-button/icon-button.module';



@NgModule({
  declarations: [UserNameNotificationPopupComponent],
  imports: [
    CommonModule,
    IconButtonModule,
    CounterModule,
    FormsModule
    
  ],exports: [
    UserNameNotificationPopupComponent
  ]
})
export class UserNameNotificationPopupModule { }