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

      this.close();
      this.openNotificationPopup(listUpdate.selectedItems![0] as NotificationItem);
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
    this.archiveList.listManager.selectedItem = null!;
    this.notificationItem.isNew = true;
    this.notificationService.newNotifications.push(this.notificationItem)
    this.notificationService.archiveNotifications.splice(this.notificationItem.index!, 1);
    this.notificationService.notificationCount += this.notificationItem.count;
    this.notificationService.newNotifications.sort((a, b) => (a.creationDate > b.creationDate) ? -1 : 1);

    // Update database
    this.dataService.put('api/Notifications/Archive',
      {
        notificationGroupId: this.notificationItem.notificationGroupId
      }).subscribe();
  }



  ngOnDestroy() {
    window.removeEventListener('mousedown', this.mousedown);
  }
}