import { Component } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { ListUpdateType } from '../../classes/enums';
import { ListOptions } from '../../classes/list-options';
import { ListUpdate } from '../../classes/list-update';
import { NotificationItem } from '../../classes/notification-item';
import { MessageNotificationPopupComponent } from '../message-notification-popup/message-notification-popup.component';
import { ProductNotificationPopupComponent } from '../product-notification-popup/product-notification-popup.component';
import { ReviewNotificationPopupComponent } from '../review-notification-popup/review-notification-popup.component';

@Component({
  templateUrl: './notifications-popup.component.html',
  styleUrls: ['./notifications-popup.component.scss']
})
export class NotificationsPopupComponent extends LazyLoad {
  public notifications: Array<NotificationItem> = new Array<NotificationItem>();
  public newTabSelected: boolean = true;
  public listOptions: ListOptions = {
    editable: false,
    multiselectable: false
  }

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) {
    super(lazyLoadingService)
  }
  

  onOpen() {
    this.dataService.get<Array<NotificationItem>>('api/Notifications', [{ key: 'isNew', value: true }])
      .subscribe((notifications: Array<NotificationItem>) => {
        notifications.forEach(x => {
          this.notifications.push(x);
        })
      })
  }


  onListUpdate(listUpdate: ListUpdate) {
    if (listUpdate.type == ListUpdateType.SelectedItems) {


      this.openNotificationPopup(listUpdate.selectedItems![0] as NotificationItem);
      this.close();
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
      }, SpinnerAction.None).then((messageNotificationPopup: MessageNotificationPopupComponent) => {
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
      }, SpinnerAction.None).then((reviewNotificationPopup: ReviewNotificationPopupComponent) => {
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
      }, SpinnerAction.None).then((productNotificationPopup: ProductNotificationPopupComponent) => {
        productNotificationPopup.notificationItem = notificationItem;
      })
    }


  }
}