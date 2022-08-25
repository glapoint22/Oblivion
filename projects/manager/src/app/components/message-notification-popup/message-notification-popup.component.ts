import { Component } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService } from 'common';
import { NotificationItem } from '../../classes/notification-item';
import { NotificationMessage } from '../../classes/notification-message';

@Component({
  templateUrl: './message-notification-popup.component.html',
  styleUrls: ['./message-notification-popup.component.scss']
})
export class MessageNotificationPopupComponent extends LazyLoad {
  public notificationItem!: NotificationItem;

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) {
    super(lazyLoadingService)
  }

  onOpen() {
    this.dataService.get<NotificationMessage>('api/Notifications/Message', [
      { key: 'type', value: this.notificationItem.type },
      { key: 'state', value: this.notificationItem.state },
      { key: 'email', value: this.notificationItem.email }
    ]).subscribe((notificationMessage: NotificationMessage) => {
      console.log(notificationMessage)
    });
  }
}