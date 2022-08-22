import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsPopupComponent } from './notifications-popup.component';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { NotificationListModule } from '../lists/notification-list/notification-list.module';

@NgModule({
  declarations: [NotificationsPopupComponent],
  imports: [
    CommonModule,

    IconButtonModule,
    NotificationListModule
  ],
  exports: [NotificationsPopupComponent]
})
export class NotificationsPopupModule { }