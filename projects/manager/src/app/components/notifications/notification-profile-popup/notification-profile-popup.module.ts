import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationProfilePopupComponent } from './notification-profile-popup.component';



@NgModule({
  declarations: [NotificationProfilePopupComponent],
  imports: [
    CommonModule
  ],
  exports: [NotificationProfilePopupComponent]
})
export class NotificationProfilePopupModule { }