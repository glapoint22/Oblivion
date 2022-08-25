import { Component } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService } from 'common';
import { NotificationItem } from '../../classes/notification-item';
import { NotificationReviewComplaint } from '../../classes/notification-review-complaint';

@Component({
  templateUrl: './review-complaint-notification-popup.component.html',
  styleUrls: ['./review-complaint-notification-popup.component.scss']
})
export class ReviewComplaintNotificationPopupComponent extends LazyLoad {
  public notificationItem!: NotificationItem;

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) {
    super(lazyLoadingService)
  }

  onOpen() {
    this.dataService.get<NotificationReviewComplaint>('api/Notifications/ReviewComplaint', [
      { key: 'productId', value: this.notificationItem.productId },
      { key: 'type', value: this.notificationItem.type },
      { key: 'state', value: this.notificationItem.state }
    ]).subscribe((notificationReviewComplaint: NotificationReviewComplaint) => {
      console.log(notificationReviewComplaint)
    });
  }
}