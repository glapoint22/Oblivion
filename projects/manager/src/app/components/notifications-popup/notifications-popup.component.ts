import { Component } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService } from 'common';
import { ListUpdateType } from '../../classes/enums';
import { ListOptions } from '../../classes/list-options';
import { ListUpdate } from '../../classes/list-update';
import { NotificationItem } from '../../classes/notification-item';

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
    this.dataService.get<Array<NotificationItem>>('api/Notifications/Load')
      .subscribe((notifications: Array<NotificationItem>) => {
        notifications.forEach(x => {
          x.name = this.getNotificationName(x.type, x.email);
          this.notifications.push(x);
        })
      })
  }


  onListUpdate(listUpdate: ListUpdate) {
    if (listUpdate.type == ListUpdateType.SelectedItems) {
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
}