import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationItemComponent } from './notification-item.component';



@NgModule({
  declarations: [NotificationItemComponent],
  imports: [
    CommonModule
  ],
  exports: [
    NotificationItemComponent
  ]
})
export class NotificationItemModule { }
