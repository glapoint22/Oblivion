import { Component } from '@angular/core';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';

@Component({
  templateUrl: './profile-image-notification-popup.component.html',
  styleUrls: ['../notification-popup/notification-popup.component.scss', './profile-image-notification-popup.component.scss']
})
export class ProfileImageNotificationPopupComponent extends NotificationPopupComponent { 
  ngOnInit(): void {
    
  }
}