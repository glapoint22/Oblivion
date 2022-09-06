import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
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
  public notification!: Array<NotificationMessage>;
  public notificationItem!: NotificationItem;
  public notificationUserProfilePopup!: NotificationUserProfilePopupComponent;

  @ViewChild('notificationUserProfilePopupContainer', { read: ViewContainerRef }) notificationUserProfilePopupContainer!: ViewContainerRef;

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) {
    super(lazyLoadingService)
  }

  ngOnInit() {
    super.ngOnInit();
    window.addEventListener('mousedown', this.mousedown);

    this.dataService.get<Array<NotificationMessage>>('api/Notifications/Message', [
      { key: 'email', value: this.notificationItem.email },
      { key: 'type', value: this.notificationItem.type },
      { key: 'archiveDate', value: this.notificationItem.archiveDate ? this.notificationItem.archiveDate : '' }
    ]).subscribe((notificationMessages: Array<NotificationMessage>) => {
      this.notification = notificationMessages;
    });
  }




  mousedown = () => {
    if (this.notificationUserProfilePopup) this.notificationUserProfilePopup.close();
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
        notificationUserProfilePopup.user = this.notification[this.userIndex];
      });
  }


  onEscape(): void {
    if (this.notificationUserProfilePopupContainer.length > 0) {
      this.notificationUserProfilePopup.close();
    } else {
      super.onEscape();
    }
  }




  close(): void {

    // Loop through all the messages
    this.notification.forEach((message, index) => {

      // If no reply was written for this current message when this form was opened
      if (!message.employeeReplyId) {
        
        // And if now a new reply has been written in this current message
        if (message.reply != null) {

          this.dataService.post('api/Notifications/PostReply', {
            messageId: message.messageId,
            email: this.notificationItem.email,
            notificationType: this.notificationItem.type,
            archiveDate: this.notificationItem.archiveDate,
            text: message.reply.trim()
          }).subscribe();
        }
      }
    })




    // If this is a new notification and it has NOT been sent to archive yet
    if (this.notificationItem.isNew) {

      // Send it to archive
      this.dataService.put('api/Notifications/Message/Archive',
        {
          email: this.notificationItem.email,
          notificationType: this.notificationItem.type
        }).subscribe();
    }

    // Now close
    super.close();
  }





  ngOnDestroy() {
    window.removeEventListener('mousedown', this.mousedown);
  }
}