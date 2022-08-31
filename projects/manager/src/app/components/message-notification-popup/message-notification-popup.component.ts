import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { NotificationItem } from '../../classes/notification-item';
import { NotificationMessage } from '../../classes/notification-message';
import { NotificationUserProfilePopupComponent } from '../notification-user-profile-popup/notification-user-profile-popup.component';

@Component({
  templateUrl: './message-notification-popup.component.html',
  styleUrls: ['./message-notification-popup.component.scss']
})
export class MessageNotificationPopupComponent extends LazyLoad {
  public userIndex: number = 0;
  public notification!: NotificationMessage;
  public notificationItem!: NotificationItem;
  public notificationUserProfilePopup!: NotificationUserProfilePopupComponent;

  @ViewChild('notificationUserProfilePopupContainer', { read: ViewContainerRef }) notificationUserProfilePopupContainer!: ViewContainerRef;

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) {
    super(lazyLoadingService)
  }

  ngOnInit() {
    super.ngOnInit();
    window.addEventListener('mousedown', this.mousedown);
  }

  mousedown = () => {
    if (this.notificationUserProfilePopup) this.notificationUserProfilePopup.close();
  }

  onOpen() {
    this.dataService.get<NotificationMessage>('api/Notifications/Message', [
      { key: 'type', value: this.notificationItem.type },
      { key: 'state', value: this.notificationItem.state },
      { key: 'email', value: this.notificationItem.email }
    ]).subscribe((notificationMessage: NotificationMessage) => {
      this.notification = notificationMessage;
    });
  }


  openNotificationUserProfilePopup() {
    if (this.notificationUserProfilePopupContainer.length > 0) {
      this.notificationUserProfilePopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { NotificationUserProfilePopupComponent } = await import('../notification-user-profile-popup/notification-user-profile-popup.component');
      const { NotificationUserProfilePopupModule } = await import('../notification-user-profile-popup/notification-user-profile-popup.module');
      return {
        component: NotificationUserProfilePopupComponent,
        module: NotificationUserProfilePopupModule
      }
    }, SpinnerAction.None, this.notificationUserProfilePopupContainer)
      .then((notificationUserProfilePopup: NotificationUserProfilePopupComponent) => {
        this.notificationUserProfilePopup = notificationUserProfilePopup;
        notificationUserProfilePopup.user = this.notification.users[this.userIndex];
      });
  }


  onEscape(): void {
    if (this.notificationUserProfilePopupContainer.length > 0) {
      this.notificationUserProfilePopup.close();
    }else {
      super.onEscape();
    }
  }


  ngOnDestroy() {
    window.removeEventListener('mousedown', this.mousedown);
  }
}