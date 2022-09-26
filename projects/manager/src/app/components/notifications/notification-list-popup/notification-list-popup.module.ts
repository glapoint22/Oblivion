import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationListPopupComponent } from './notification-list-popup.component';
import { IconButtonModule } from '../../icon-button/icon-button.module';
import { NotificationListModule } from '../../lists/notification-list/notification-list.module';

@NgModule({
  declarations: [NotificationListPopupComponent],
  imports: [
    CommonModule,

    IconButtonModule,
    NotificationListModule
  ],
  exports: [NotificationListPopupComponent]
})
export class NotificationListPopupModule { }