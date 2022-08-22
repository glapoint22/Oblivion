import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationListComponent } from './notification-list.component';
import { NotificationItemModule } from '../../items/notification-item/notification-item.module';



@NgModule({
  declarations: [NotificationListComponent],
  imports: [
    CommonModule,
    NotificationItemModule
  ],
  exports: [NotificationListComponent]
})
export class NotificationListModule { }