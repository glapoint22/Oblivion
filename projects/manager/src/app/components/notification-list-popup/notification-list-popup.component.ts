import { Component, ViewChild } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { ListUpdateType, MenuOptionType } from '../../classes/enums';
import { ListOptions } from '../../classes/list-options';
import { ListUpdate } from '../../classes/list-update';
import { NotificationItem } from '../../classes/notification-item';
import { NotificationService } from '../../services/notification/notification.service';
import { NotificationListComponent } from '../lists/notification-list/notification-list.component';
import { MessageNotificationPopupComponent } from '../message-notification-popup/message-notification-popup.component';
import { ProductNotificationPopupComponent } from '../product-notification-popup/product-notification-popup.component';
import { ReviewNotificationPopupComponent } from '../review-notification-popup/review-notification-popup.component';

@Component({
  templateUrl: './notification-list-popup.component.html',
  styleUrls: ['./notification-list-popup.component.scss']
})
export class NotificationListPopupComponent extends LazyLoad {
  private notificationItem!: NotificationItem;


  public newTabSelected: boolean = true;
  public newListOptions: ListOptions = {
    editable: false,
    multiselectable: false,
    showSelection: false,
    cursor: 'pointer'
  }

  public archiveListOptions: ListOptions = {
    editable: false,
    multiselectable: false,
    showSelection: false,
    cursor: 'pointer',


    menu: {
      parentObj: this,
      menuOptions: [
        {
          type: MenuOptionType.MenuItem,
          name: 'Restore as New',
          optionFunction: this.restore
        }
      ]
    }
  }


  @ViewChild('archiveList') archiveList!: NotificationListComponent;


  constructor(lazyLoadingService: LazyLoadingService, public notificationService: NotificationService, private dataService: DataService) {
    super(lazyLoadingService)
  }



  ngOnInit() {
    super.ngOnInit();
    window.addEventListener('mousedown', () => this.mousedown());
  }




  mousedown = () => {
    if (!this.archiveList || (this.archiveList && !this.archiveList.listManager.contextMenuOpen && !this.archiveList.listManager.selectedItem)) {
      this.close();
    }

    if (this.archiveList && !this.archiveList.listManager.contextMenuOpen) {
      this.archiveList.listManager.showSelection = false;
    }
  }





  onListUpdate(listUpdate: ListUpdate) {
    if (listUpdate.type == ListUpdateType.SelectedItems) {

      if (this.archiveList) {
        if (listUpdate.rightClick) {
          this.archiveList.listManager.showSelection = true;
          this.notificationItem = listUpdate.selectedItems![0] as NotificationItem;
          return

        } else {
          this.archiveList.listManager.showSelection = false;
        }
      }

      if (!listUpdate.rightClick) {
        this.close();
        this.openNotificationPopup(listUpdate.selectedItems![0] as NotificationItem);
      }
    }
  }





  openNotificationPopup(notificationItem: NotificationItem) {
    if (notificationItem.notificationType == 0) {
      this.lazyLoadingService.load(async () => {
        const { MessageNotificationPopupComponent } = await import('../message-notification-popup/message-notification-popup.component');
        const { MessageNotificationPopupModule } = await import('../message-notification-popup/message-notification-popup.module');
        return {
          component: MessageNotificationPopupComponent,
          module: MessageNotificationPopupModule
        }
      }, SpinnerAction.None, this.notificationService.notificationPopupContainer)
        .then((messageNotificationPopup: MessageNotificationPopupComponent) => {
          messageNotificationPopup.notificationItem = notificationItem;
        })
    }


    if (notificationItem.notificationType == 1) {
      this.lazyLoadingService.load(async () => {
        const { ReviewNotificationPopupComponent: ReviewNotificationPopupComponent } = await import('../review-notification-popup/review-notification-popup.component');
        const { ReviewNotificationPopupModule: ReviewNotificationPopupModule } = await import('../review-notification-popup/review-notification-popup.module');
        return {
          component: ReviewNotificationPopupComponent,
          module: ReviewNotificationPopupModule
        }
      }, SpinnerAction.None, this.notificationService.notificationPopupContainer)
        .then((reviewNotificationPopup: ReviewNotificationPopupComponent) => {
          reviewNotificationPopup.notificationItem = notificationItem;
        })
    }


    if (notificationItem.notificationType >= 17) {
      this.lazyLoadingService.load(async () => {
        const { ProductNotificationPopupComponent } = await import('../product-notification-popup/product-notification-popup.component');
        const { ProductNotificationPopupModule } = await import('../product-notification-popup/product-notification-popup.module');
        return {
          component: ProductNotificationPopupComponent,
          module: ProductNotificationPopupModule
        }
      }, SpinnerAction.None, this.notificationService.notificationPopupContainer)
        .then((productNotificationPopup: ProductNotificationPopupComponent) => {
          productNotificationPopup.notificationItem = notificationItem;
        })
    }
  }


  restore() {
    this.notificationItem.isNew = true;
    this.notificationItem.selected = false;
    this.notificationItem.selectType = null!;
    this.archiveList.listManager.selectedItem = null!;

    // If the type of this notification is a message, see if the sender of this message happens to have a message sitting in the NEW list
    const newMessageNotificationItem = this.notificationService.newNotifications.find(x => x.notificationType == 0 && x.name == this.notificationItem.name);
    // If the sender of this message notification has a message sitting in the NEW list
    if (newMessageNotificationItem) {
      // Increase the count for the message notification that is sitting in the NEW list by the number of messages in the message notification from the ARCHIVE list
      newMessageNotificationItem.count += this.notificationItem.count;
    }

    // If the notification is anything other than a message notification
    if (this.notificationItem.notificationType != 0 ||
      // Or the notification is a message notification but the sender of that message
      // notification does NOT have a NEW message notification sitting in the NEW list
      !newMessageNotificationItem) {
      // Then put that notification back into the NEW list
      this.notificationService.newNotifications.push(this.notificationItem)
      this.notificationService.newNotifications.sort((a, b) => (a.creationDate > b.creationDate) ? -1 : 1);
    }

    // Remove the notification from the archive list
    this.notificationService.archiveNotifications.splice(this.notificationItem.index!, 1);
    // Update the count for the notification bell
    this.notificationService.notificationCount += this.notificationItem.count;


    // Update database
    this.dataService.put('api/Notifications/Archive',
      {
        restore: true,
        notificationGroupId: this.notificationItem.notificationGroupId,
        restoreAllMessagesInGroup: this.notificationItem.notificationType == 0 ? true : false
      }).subscribe();
  }



  onEscape(): void {
    if (!this.archiveList || (this.archiveList && !this.archiveList.listManager.contextMenuOpen && !this.archiveList.listManager.selectedItem)) {
      this.close();
    }

    if (this.archiveList && !this.archiveList.listManager.contextMenuOpen) {
      this.archiveList.listManager.showSelection = false;
    }
  }



  ngOnDestroy() {
    window.removeEventListener('mousedown', this.mousedown);
  }
}