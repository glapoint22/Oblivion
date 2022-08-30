import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { NotificationItem } from '../../classes/notification-item';
import { NotificationProduct } from '../../classes/notification-product';
import { NotificationUserProfilePopupComponent } from '../notification-user-profile-popup/notification-user-profile-popup.component';

@Component({
  templateUrl: './product-notification-popup.component.html',
  styleUrls: ['./product-notification-popup.component.scss']
})
export class ProductNotificationPopupComponent extends LazyLoad {
  public userIndex: number = 0;
  public notification!: NotificationProduct;
  public notificationItem!: NotificationItem;
  public notificationUserProfilePopup!: NotificationUserProfilePopupComponent;

  @ViewChild('profilePopupContainer', { read: ViewContainerRef }) profilePopupContainer!: ViewContainerRef;

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
    this.dataService.get<NotificationProduct>('api/Notifications/Product', [
      { key: 'productId', value: this.notificationItem.productId },
      { key: 'type', value: this.notificationItem.type },
      { key: 'state', value: this.notificationItem.state }
    ]).subscribe((notificationProduct: NotificationProduct) => {
      console.log(notificationProduct)
      this.notification = notificationProduct;
    });
  }



  openNotificationUserProfilePopup() {
    if (this.profilePopupContainer.length > 0) {
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
    }, SpinnerAction.None, this.profilePopupContainer)
      .then((notificationUserProfilePopup: NotificationUserProfilePopupComponent) => {
        this.notificationUserProfilePopup = notificationUserProfilePopup;
        notificationUserProfilePopup.user = this.notification.users[this.userIndex];
      });
  }



  ngOnDestroy() {
    window.removeEventListener('mousedown', this.mousedown);
  }
}