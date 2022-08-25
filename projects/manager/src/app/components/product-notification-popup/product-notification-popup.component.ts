import { Component } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService } from 'common';
import { NotificationItem } from '../../classes/notification-item';
import { NotificationProduct } from '../../classes/notification-product';

@Component({
  templateUrl: './product-notification-popup.component.html',
  styleUrls: ['./product-notification-popup.component.scss']
})
export class ProductNotificationPopupComponent extends LazyLoad {
  public notificationItem!: NotificationItem;

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) {
    super(lazyLoadingService)
  }

  onOpen() {
    this.dataService.get<NotificationProduct>('api/Notifications/Product', [
      { key: 'productId', value: this.notificationItem.productId },
      { key: 'type', value: this.notificationItem.type },
      { key: 'state', value: this.notificationItem.state }
    ]).subscribe((notificationProduct: NotificationProduct) => {
      console.log(notificationProduct)
    });
  }
}