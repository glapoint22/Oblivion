import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { NotificationItem } from '../../classes/notification-item';
import { NotificationReviewComplaint } from '../../classes/notification-review-complaint';
import { NotificationProfilePopupUser } from '../../classes/notification-profile-popup-user';
import { NotificationUserProfilePopupComponent } from '../notification-user-profile-popup/notification-user-profile-popup.component';

@Component({
  templateUrl: './review-complaint-notification-popup.component.html',
  styleUrls: ['./review-complaint-notification-popup.component.scss']
})
export class ReviewComplaintNotificationPopupComponent extends LazyLoad {
  public userIndex: number = 0;
  public notification!: NotificationReviewComplaint;
  public notificationItem!: NotificationItem;
  public userProfilePopup!: NotificationUserProfilePopupComponent;
  public reviewProfilePopup!: NotificationUserProfilePopupComponent;

  @ViewChild('userProfileContainer', { read: ViewContainerRef }) userProfilePopupContainer!: ViewContainerRef;
  @ViewChild('reviewProfileContainer', { read: ViewContainerRef }) reviewProfilePopupContainer!: ViewContainerRef;

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) {
    super(lazyLoadingService)
  }


  ngOnInit() {
    super.ngOnInit();
    window.addEventListener('mousedown', this.mousedown);
  }

  mousedown = () => {
    if (this.userProfilePopup) this.userProfilePopup.close();
    if (this.reviewProfilePopup) this.reviewProfilePopup.close();
  }




  onOpen() {
    this.dataService.get<NotificationReviewComplaint>('api/Notifications/ReviewComplaint', [
      { key: 'productId', value: this.notificationItem.productId },
      { key: 'type', value: this.notificationItem.type },
      { key: 'state', value: this.notificationItem.state }
    ]).subscribe((notificationReviewComplaint: NotificationReviewComplaint) => {
      this.notification = notificationReviewComplaint;
    });
  }



  openUserProfilePopup(notificationUser: NotificationProfilePopupUser) {
    if (this.userProfilePopupContainer.length > 0) {
      this.userProfilePopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { NotificationUserProfilePopupComponent } = await import('../notification-user-profile-popup/notification-user-profile-popup.component');
      const { NotificationUserProfilePopupModule } = await import('../notification-user-profile-popup/notification-user-profile-popup.module');
      return {
        component: NotificationUserProfilePopupComponent,
        module: NotificationUserProfilePopupModule
      }
    }, SpinnerAction.None, this.userProfilePopupContainer)
      .then((userProfilePopup: NotificationUserProfilePopupComponent) => {
        this.userProfilePopup = userProfilePopup;
        userProfilePopup.user = notificationUser;
      });
  }



  openReviewProfilePopup(notificationUser: NotificationProfilePopupUser) {
    if (this.reviewProfilePopupContainer.length > 0) {
      this.reviewProfilePopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { NotificationUserProfilePopupComponent } = await import('../notification-user-profile-popup/notification-user-profile-popup.component');
      const { NotificationUserProfilePopupModule } = await import('../notification-user-profile-popup/notification-user-profile-popup.module');
      return {
        component: NotificationUserProfilePopupComponent,
        module: NotificationUserProfilePopupModule
      }
    }, SpinnerAction.None, this.reviewProfilePopupContainer)
      .then((reviewProfilePopup: NotificationUserProfilePopupComponent) => {
        this.reviewProfilePopup = reviewProfilePopup;
        reviewProfilePopup.user = notificationUser;
        reviewProfilePopup.isReview = true;
      });
  }


  onEscape(): void {
    if (this.userProfilePopupContainer.length > 0 || this.reviewProfilePopupContainer.length > 0) {
      if (this.userProfilePopupContainer.length > 0) this.userProfilePopup.close();
      if (this.reviewProfilePopupContainer.length > 0) this.reviewProfilePopup.close();

    } else {
      super.onEscape();
    }
  }


  ngOnDestroy() {
    window.removeEventListener('mousedown', this.mousedown);
  }
}