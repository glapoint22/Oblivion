import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserImageNotificationPopupComponent } from './user-image-notification-popup.component';
import { IconButtonModule } from '../../icon-button/icon-button.module';
import { CounterModule } from '../../counter/counter.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [UserImageNotificationPopupComponent],
  imports: [
    CommonModule,
    IconButtonModule,
    CounterModule,
    FormsModule
  ],
  exports: [
    UserImageNotificationPopupComponent
  ]
})
export class UserImageNotificationPopupModule { }