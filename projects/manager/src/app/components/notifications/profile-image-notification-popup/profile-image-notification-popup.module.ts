import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileImageNotificationPopupComponent } from './profile-image-notification-popup.component';
import { IconButtonModule } from '../../icon-button/icon-button.module';
import { CounterModule } from '../../counter/counter.module';



@NgModule({
  declarations: [ProfileImageNotificationPopupComponent],
  imports: [
    CommonModule,
    IconButtonModule,
    CounterModule
  ],
  exports: [
    ProfileImageNotificationPopupComponent
  ]
})
export class ProfileImageNotificationPopupModule { }
