import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { MenuOptionType } from '../../classes/enums';
import { NotificationItem } from '../../classes/notification-item';
import { NotificationMessage } from '../../classes/notification-message';
import { ContextMenuComponent } from '../../components/context-menu/context-menu.component';
import { NotificationService } from '../../services/notification/notification.service';
import { NotificationProfilePopupComponent } from '../notification-profile-popup/notification-profile-popup.component';

@Component({
  templateUrl: './message-notification-popup.component.html',
  styleUrls: ['./message-notification-popup.component.scss']
})
export class MessageNotificationPopupComponent extends LazyLoad {
  private contextMenu!: ContextMenuComponent;

  public messageIndex: number = 0;
  public sendButtonDisabled: boolean = true;
  public notificationItem!: NotificationItem;
  public notification!: Array<NotificationMessage>;
  public profilePopup!: NotificationProfilePopupComponent;

  @ViewChild('profilePopupContainer', { read: ViewContainerRef }) profilePopupContainer!: ViewContainerRef;

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService, private notificationService: NotificationService) {
    super(lazyLoadingService)
  }



  ngOnInit() {
    super.ngOnInit();
    this.notificationItem.selected = false;
    this.notificationItem.selectType = null!;

    this.dataService.get<Array<NotificationMessage>>('api/Notifications/Message', [
      { key: 'notificationGroupId', value: this.notificationItem.notificationGroupId },
      { key: 'isNew', value: this.notificationItem.isNew }
    ]).subscribe((notificationMessages: Array<NotificationMessage>) => {
      this.notification = notificationMessages;
    });
  }




  openContextMenu(ellipsis: HTMLElement) {
    if (this.contextMenu) {
      this.contextMenu.close();
      return;
    }
    this.lazyLoadingService.load(async () => {
      const { ContextMenuComponent } = await import('../../components/context-menu/context-menu.component');
      const { ContextMenuModule } = await import('../../components/context-menu/context-menu.module');

      return {
        component: ContextMenuComponent,
        module: ContextMenuModule
      }
    }, SpinnerAction.None).then((contextMenu: ContextMenuComponent) => {
      this.contextMenu = contextMenu;
      contextMenu.xPos = ellipsis.getBoundingClientRect().left + 25;
      contextMenu.yPos = ellipsis.getBoundingClientRect().top + 21;
      contextMenu.parentObj = this;
      contextMenu.options = [
        {
          type: MenuOptionType.MenuItem,
          name: this.notificationItem.isNew ? 'Archive All Messages' : 'Restore as New',
          optionFunction: () => {
            this.notificationItem.isNew ? this.archiveAll() : this.restore()
            
          }
        },
        {
          type: MenuOptionType.MenuItem,
          name: 'Restore All Messages as New',
          hidden: this.notificationItem.isNew || (!this.notificationItem.isNew && this.notificationItem.count == 1),
          optionFunction: () => {
            this.restoreAll()
          }
        },
        {
          type: MenuOptionType.Divider,
          hidden: this.notificationItem.isNew ? true : false
        },
        {
          type: MenuOptionType.MenuItem,
          name: 'Delete',
          hidden: this.notificationItem.isNew ? true : false,
          optionFunction: () => {
            null
          }
        },
        {
          type: MenuOptionType.MenuItem,
          name: 'Delete All Messages',
          hidden: this.notificationItem.isNew || (!this.notificationItem.isNew && this.notificationItem.count == 1),
          optionFunction: () => {
            null
          }
        }
      ]

      const contextMenuOpenListener = contextMenu.menuOpen.subscribe((menuOpen: boolean) => {
        contextMenuOpenListener.unsubscribe();
        this.contextMenu = null!;
      })
    });
  }





  openProfilePopup() {
    if (this.profilePopupContainer.length > 0) {
      this.profilePopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { NotificationProfilePopupComponent } = await import('../notification-profile-popup/notification-profile-popup.component');
      const { NotificationProfilePopupModule } = await import('../notification-profile-popup/notification-profile-popup.module');
      return {
        component: NotificationProfilePopupComponent,
        module: NotificationProfilePopupModule
      }
    }, SpinnerAction.None, this.profilePopupContainer)
      .then((profilePopup: NotificationProfilePopupComponent) => {
        this.profilePopup = profilePopup;
        profilePopup.user = this.notification[this.messageIndex];
      });
  }



  setSendButtonDisabled() {
    // And if now a new reply has been written in this current message and it's not just empty spaces
    if (!this.notification[this.messageIndex].employeeMessageDate && this.notification[this.messageIndex].employeeMessage != null && this.notification[this.messageIndex].employeeMessage.trim().length > 0) {
      this.sendButtonDisabled = false;

    } else {
      this.sendButtonDisabled = true;
    }
  }


  onEscape(): void {
    if (this.profilePopupContainer.length > 0) {
      this.profilePopup.close();
    } else {
      if (!this.contextMenu) {
        this.close();
      }
    }
  }



  sendMessage() {
    this.dataService.post('api/Notifications/PostMessage', {
      notificationId: this.notification[this.messageIndex].notificationId,
      message: this.notification[this.messageIndex].employeeMessage.trim()
    }).subscribe();

    if (this.notificationItem.isNew) this.archive();
  }



  archive() {
    const notificationId = this.notification[this.messageIndex].notificationId;

    // --- For the NEW list --- \\

    // If there is more than one message in this message notification (i.e. counter: 1/3)
    if (this.notificationItem.count > 1) {
      // Then first, minus the count for the notification's red circle by one
      this.notificationItem.count -= 1;
      // And then remove the current message from the popup
      this.notification.splice(this.messageIndex, 1);
      // Set the counter so that the first message is being displayed (if not already)
      this.messageIndex = 0;
      // Disable send button
      this.setSendButtonDisabled();

      // If there is only one message in this message notification
    } else {

      // Remove the notification from the NEW list
      const newNotificationItemIndex = this.notificationService.newNotifications.findIndex(x => x.name == this.notificationItem.name);
      this.notificationService.newNotifications.splice(newNotificationItemIndex, 1);
      // Then close the popup
      this.close();
    }


    // --- For the ARCHIVE list --- \\

    // See if the sender of this message already has a previous message that was archived
    const archivedNotificationItemIndex = this.notificationService.archiveNotifications.findIndex(x => x.name == this.notificationItem.name);

    // If so
    if (archivedNotificationItemIndex != -1) {
      // Make a copy of that archive message notification that's in the archive list
      const archivedNotificationItemCopy = this.notificationService.archiveNotifications[archivedNotificationItemIndex];
      // Increase the count for that archive message notification's red circle by one
      archivedNotificationItemCopy.count += 1;
      // Then remove that archive notification from the archive list and then put it back up at the top of the list
      this.notificationService.archiveNotifications.splice(archivedNotificationItemIndex, 1);
      this.notificationService.archiveNotifications.unshift(archivedNotificationItemCopy);

      // If the sender of this message NEVER had a message that was archiveded
    } else {

      // Then we need to create a new archived message
      const newArchiveNotificationItem = new NotificationItem();
      newArchiveNotificationItem.isNew = false;
      newArchiveNotificationItem.id = this.notificationItem.id;
      newArchiveNotificationItem.notificationType = this.notificationItem.notificationType;
      newArchiveNotificationItem.notificationGroupId = this.notificationItem.notificationGroupId;
      newArchiveNotificationItem.image = this.notificationItem.image;
      newArchiveNotificationItem.creationDate = this.notificationItem.creationDate;
      newArchiveNotificationItem.name = this.notificationItem.name;
      newArchiveNotificationItem.productName = this.notificationItem.productName;
      newArchiveNotificationItem.count = 1;
      // And then make it the first item in the archive list
      this.notificationService.archiveNotifications.unshift(newArchiveNotificationItem);
    }

    // Update the count for the notification bell
    this.notificationService.notificationCount -= 1;

    // Update database
    this.dataService.put('api/Notifications/Archive',
      {
        notificationGroupId: this.notificationItem.notificationGroupId,
        notificationId: notificationId
      }).subscribe();
  }




  archiveAll() {
    // --- For the NEW list --- \\

    // Remove the notification from the NEW list
    const newNotificationItemIndex = this.notificationService.newNotifications.findIndex(x => x.name == this.notificationItem.name);
    this.notificationService.newNotifications.splice(newNotificationItemIndex, 1);
    // Then close the popup
    this.close();


    // --- For the ARCHIVE list --- \\

    // See if the sender of this message already has a previous message that was archived
    const archivedNotificationItemIndex = this.notificationService.archiveNotifications.findIndex(x => x.name == this.notificationItem.name);

    // If so
    if (archivedNotificationItemIndex != -1) {
      // Make a copy of that archive message notification that's in the archive list
      const archivedNotificationItemCopy = this.notificationService.archiveNotifications[archivedNotificationItemIndex];
      // Increase the count for the message notification in the ARCHIVE list by the number of messages in the message notification from the NEW list
      archivedNotificationItemCopy.count += this.notificationItem.count;
      // Then remove that archive notification from the archive list and then put it back up at the top of the list
      this.notificationService.archiveNotifications.splice(archivedNotificationItemIndex, 1);
      this.notificationService.archiveNotifications.unshift(archivedNotificationItemCopy);

      // If the sender of this message NEVER had a message that was archiveded
    } else {

      // Then we need to create a new archived message
      const newArchiveNotificationItem = new NotificationItem();
      newArchiveNotificationItem.isNew = false;
      newArchiveNotificationItem.id = this.notificationItem.id;
      newArchiveNotificationItem.notificationType = this.notificationItem.notificationType;
      newArchiveNotificationItem.notificationGroupId = this.notificationItem.notificationGroupId;
      newArchiveNotificationItem.image = this.notificationItem.image;
      newArchiveNotificationItem.creationDate = this.notificationItem.creationDate;
      newArchiveNotificationItem.name = this.notificationItem.name;
      newArchiveNotificationItem.productName = this.notificationItem.productName;
      newArchiveNotificationItem.count = this.notificationItem.count;
      // And then make it the first item in the archive list
      this.notificationService.archiveNotifications.unshift(newArchiveNotificationItem);
    }

    // Update the count for the notification bell
    this.notificationService.notificationCount -= this.notificationItem.count;

    // Update database
    this.dataService.put('api/Notifications/Archive',
      {
        notificationGroupId: this.notificationItem.notificationGroupId,
        archiveAllMessagesInGroup: true
      }).subscribe();
  }



















  restore() {
    const notificationId = this.notification[this.messageIndex].notificationId;

    // --- For the ARCHIVE list --- \\

    // If there is more than one message in this message notification (i.e. counter: 1/3)
    if (this.notificationItem.count > 1) {
      // Then first, minus the count for the notification's red circle by one
      this.notificationItem.count -= 1;
      // And then remove the current message from the popup
      this.notification.splice(this.messageIndex, 1);
      // Set the counter so that the first message is being displayed (if not already)
      this.messageIndex = 0;
      // Disable send button
      this.setSendButtonDisabled();

      // If there is only one message in this message notification
    } else {

      // Remove the notification from the ARCHIVE list
      const archiveNotificationItemIndex = this.notificationService.archiveNotifications.findIndex(x => x.name == this.notificationItem.name);
      this.notificationService.archiveNotifications.splice(archiveNotificationItemIndex, 1);
      // Then close the popup
      this.close();
    }


    // --- For the NEW list --- \\

    // See if the sender of this message has a message in the NEW list
    const newNotificationItemIndex = this.notificationService.newNotifications.findIndex(x => x.name == this.notificationItem.name);

    // If so
    if (newNotificationItemIndex != -1) {
      // Make a copy of that new message notification that's in the new list
      const newNotificationItemCopy = this.notificationService.newNotifications[newNotificationItemIndex];
      // Increase the count for that new message notification's red circle by one
      newNotificationItemCopy.count += 1;

      // If the sender of this message does NOT have a message in the NEW list
    } else {

      // Then we need to create a new message
      const newNotificationItem = new NotificationItem();
      newNotificationItem.isNew = true;
      newNotificationItem.id = this.notificationItem.id;
      newNotificationItem.notificationType = this.notificationItem.notificationType;
      newNotificationItem.notificationGroupId = this.notificationItem.notificationGroupId;
      newNotificationItem.image = this.notificationItem.image;
      newNotificationItem.creationDate = this.notificationItem.creationDate;
      newNotificationItem.name = this.notificationItem.name;
      newNotificationItem.productName = this.notificationItem.productName;
      newNotificationItem.count = 1;

      // Add the new notification item to the NEW list
      this.notificationService.newNotifications.push(newNotificationItem)
      // Sort the NEW list by the creation date of each item
      this.notificationService.newNotifications.sort((a, b) => (a.creationDate > b.creationDate) ? -1 : 1);
    }

    // Update the count for the notification bell
    this.notificationService.notificationCount += 1;


    // Update database
    this.dataService.put('api/Notifications/Archive',
      {
        restore: true,
        notificationId: notificationId,
        notificationGroupId: this.notificationItem.notificationGroupId
      }).subscribe();
  }

















  restoreAll() {
    // --- For the ARCHIVE list --- \\

    // Remove the notification from the ARCHIVE list
    const archiveNotificationItemIndex = this.notificationService.archiveNotifications.findIndex(x => x.name == this.notificationItem.name);
    this.notificationService.archiveNotifications.splice(archiveNotificationItemIndex, 1);
    // Then close the popup
    this.close();


    // --- For the NEW list --- \\

    // See if the sender of this message has a message in the NEW list
    const newNotificationItemIndex = this.notificationService.newNotifications.findIndex(x => x.name == this.notificationItem.name);

    // If so
    if (newNotificationItemIndex != -1) {
      // Make a copy of that new message notification that's in the NEW list
      const newNotificationItemCopy = this.notificationService.archiveNotifications[newNotificationItemIndex];
      // Increase the count for the message notification in the NEW list by the number of messages in the notification from the ARCHIVE list
      newNotificationItemCopy.count += this.notificationItem.count;

      // If the sender of this message does NOT have a message in the NEW list
    } else {

      // Then we need to create a new message
      const newNotificationItem = new NotificationItem();
      newNotificationItem.isNew = true;
      newNotificationItem.id = this.notificationItem.id;
      newNotificationItem.notificationType = this.notificationItem.notificationType;
      newNotificationItem.notificationGroupId = this.notificationItem.notificationGroupId;
      newNotificationItem.image = this.notificationItem.image;
      newNotificationItem.creationDate = this.notificationItem.creationDate;
      newNotificationItem.name = this.notificationItem.name;
      newNotificationItem.productName = this.notificationItem.productName;
      newNotificationItem.count = this.notificationItem.count;

      // Add the new notification item to the NEW list
      this.notificationService.newNotifications.push(newNotificationItem)
      // Sort the NEW list by the creation date of each item
      this.notificationService.newNotifications.sort((a, b) => (a.creationDate > b.creationDate) ? -1 : 1);
    }

    // Update the count for the notification bell
    this.notificationService.notificationCount += this.notificationItem.count;

    // Update database
    this.dataService.put('api/Notifications/Archive',
      {
        restore: true,
        restoreAllMessagesInGroup: true,
        notificationGroupId: this.notificationItem.notificationGroupId,
      }).subscribe();
  }







}