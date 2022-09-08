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
  public sendButtonDisabled: boolean = true;
  public notificationItem!: NotificationItem;
  public notification!: Array<NotificationMessage>;
  public notificationUserProfilePopup!: NotificationUserProfilePopupComponent;

  @ViewChild('notificationUserProfilePopupContainer', { read: ViewContainerRef }) notificationUserProfilePopupContainer!: ViewContainerRef;

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) {
    super(lazyLoadingService)
  }



  ngOnInit() {
    super.ngOnInit();
    window.addEventListener('mousedown', this.mousedown);

    this.dataService.get<Array<NotificationMessage>>('api/Notifications/Message', [
      { key: 'notificationGroupId', value: this.notificationItem.notificationGroupId }
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



  onMessageType() {
    for(let i = 0; i < this.notification.length; i++) {
      // If no reply was written for this current message when this form was opened
      if (!this.notification[i].employeeMessageDate) {
        
        // And if now a new reply has been written in this current message and it's not just empty spaces
        if (this.notification[i].employeeMessage != null && this.notification[i].employeeMessage.trim().length > 0) {
          this.sendButtonDisabled = false;
          break;
        }else {
          this.sendButtonDisabled = true;
        }
      }
    }
  }


  onEscape(): void {
    if (this.notificationUserProfilePopupContainer.length > 0) {
      this.notificationUserProfilePopup.close();
    } else {
      this.fade();
    }
  }




  close(): void {
    // Loop through all the messages
    this.notification.forEach(x => {
      // If no reply was written for this current message when this form was opened
      if (!x.employeeMessageDate) {
        
        // And if now a new reply has been written in this current message and it's not just empty spaces
        if (x.employeeMessage != null && x.employeeMessage.trim().length > 0) {
          this.dataService.post('api/Notifications/PostMessage', {
            notificationId: x.notificationId,
            message: x.employeeMessage.trim()
          }).subscribe();
        }
      }
    })

    // If this is a new notification and it has NOT been sent to archive yet
    if (this.notificationItem.isNew) {

      // Send it to archive
      this.dataService.put('api/Notifications/Archive',
        {
          notificationGroupId: this.notificationItem.notificationGroupId
        }).subscribe();
    }

    // Now close
    super.close();
  }





  ngOnDestroy() {
    window.removeEventListener('mousedown', this.mousedown);
  }
}