import { Component } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { ListUpdateType } from '../../classes/enums';
import { ListOptions } from '../../classes/list-options';
import { ListUpdate } from '../../classes/list-update';
import { NotificationItem } from '../../classes/notification-item';
import { MessageNotificationPopupComponent } from '../message-notification-popup/message-notification-popup.component';
import { ProductNotificationPopupComponent } from '../product-notification-popup/product-notification-popup.component';
import { ReviewComplaintNotificationPopupComponent } from '../review-complaint-notification-popup/review-complaint-notification-popup.component';

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
    this.dataService.get<Array<NotificationItem>>('api/Notifications/New')
      .subscribe((notifications: Array<NotificationItem>) => {
        notifications.forEach(x => {
          x.name = this.getNotificationName(x.type, x.email);
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


  getNotificationName(type: number, email: string) {
    let notificationName: string = '';

    switch (type) {
      case 0:
        notificationName = email;
        break;

      case 1:
        notificationName = "Review Complaint";
        break;

      case 2:
        notificationName = "Product Name Doesn\'t Match With Product Description";
        break;

      case 3:
        notificationName = "Product Name Doesn\'t Match With Product Image";
        break;

      case 4:
        notificationName = "Product Name (Other)";
        break;

      case 5:
        notificationName = "Product Price Too High";
        break;

      case 6:
        notificationName = "Product Price Not Correct";
        break;

      case 7:
        notificationName = "Product Price (Other)";
        break;

      case 8:
        notificationName = "Videos & Images are Different From Product";
        break;

      case 9:
        notificationName = "Not Enough Videos & Images";
        break;

      case 10:
        notificationName = "Videos & Images Not Clear";
        break;

      case 11:
        notificationName = "Videos & Images Misleading";
        break;

      case 12:
        notificationName = "Videos & Images (Other)";
        break;

      case 13:
        notificationName = "Product Description Incorrect";
        break;

      case 14:
        notificationName = "Product Description Too Vague";
        break;

      case 15:
        notificationName = "Product Description Misleading";
        break;

      case 16:
        notificationName = "Product Description (Other)";
        break;

      case 17:
        notificationName = "Product Reported As Illegal";
        break;

      case 18:
        notificationName = "Product Reported As Having Adult Content";
        break;

      case 19:
        notificationName = "Offensive Product (Other)";
        break;


      case 20:
        notificationName = "Product Inactive";
        break;

      case 21:
        notificationName = "Product site no longer in service";
        break;


      case 22:
        notificationName = "Missing Product (Other)";
        break;


    }
    return notificationName;
  }



  openNotificationPopup(notificationItem: NotificationItem) {

    if (notificationItem.type == 0) {
      this.lazyLoadingService.load(async () => {
        const { MessageNotificationPopupComponent } = await import('../message-notification-popup/message-notification-popup.component');
        const { MessageNotificationPopupModule } = await import('../message-notification-popup/message-notification-popup.module');
        return {
          component: MessageNotificationPopupComponent,
          module: MessageNotificationPopupModule
        }
      }, SpinnerAction.None).then((messageNotificationPopup: MessageNotificationPopupComponent)=> {
        messageNotificationPopup.notificationItem = notificationItem;
      })
    }


    if (notificationItem.type == 1) {
      this.lazyLoadingService.load(async () => {
        const { ReviewComplaintNotificationPopupComponent } = await import('../review-complaint-notification-popup/review-complaint-notification-popup.component');
        const { ReviewComplaintNotificationPopupModule } = await import('../review-complaint-notification-popup/review-complaint-notification-popup.module');
        return {
          component: ReviewComplaintNotificationPopupComponent,
          module: ReviewComplaintNotificationPopupModule
        }
      }, SpinnerAction.None).then((reviewComplaintNotificationPopup: ReviewComplaintNotificationPopupComponent)=> {
        reviewComplaintNotificationPopup.notificationItem = notificationItem;
      })
    }


    if (notificationItem.type >= 17) {
      this.lazyLoadingService.load(async () => {
        const { ProductNotificationPopupComponent } = await import('../product-notification-popup/product-notification-popup.component');
        const { ProductNotificationPopupModule } = await import('../product-notification-popup/product-notification-popup.module');
        return {
          component: ProductNotificationPopupComponent,
          module: ProductNotificationPopupModule
        }
      }, SpinnerAction.None).then((productNotificationPopup: ProductNotificationPopupComponent)=> {
        productNotificationPopup.notificationItem = notificationItem;
      })
    }


  }
}