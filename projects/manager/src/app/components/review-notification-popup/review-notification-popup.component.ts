import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { NotificationItem } from '../../classes/notification-item';
import { NotificationReview } from '../../classes/notification-review';
import { NotificationProfilePopupUser } from '../../classes/notification-profile-popup-user';
import { NotificationUserProfilePopupComponent } from '../notification-user-profile-popup/notification-user-profile-popup.component';

@Component({
  templateUrl: './review-notification-popup.component.html',
  styleUrls: ['./review-notification-popup.component.scss']
})
export class ReviewNotificationPopupComponent extends LazyLoad {
  public userIndex: number = 0;
  public employeeIndex: number = 0;
  public notification!: NotificationReview;
  public notificationItem!: NotificationItem;
  public userProfilePopup!: NotificationUserProfilePopupComponent;
  public reviewProfilePopup!: NotificationUserProfilePopupComponent;

  @ViewChild('userProfileContainer', { read: ViewContainerRef }) userProfilePopupContainer!: ViewContainerRef;
  @ViewChild('reviewProfileContainer', { read: ViewContainerRef }) reviewProfilePopupContainer!: ViewContainerRef;
  @ViewChild('notes') notes!: ElementRef<HTMLTextAreaElement>;

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) {
    super(lazyLoadingService)
  }


  ngOnInit() {
    super.ngOnInit();
    window.addEventListener('mousedown', this.mousedown);

    this.dataService.get<NotificationReview>('api/Notifications/Review', [
      { key: 'productId', value: this.notificationItem.productId },
      { key: 'type', value: this.notificationItem.type },
      { key: 'archiveDate', value: this.notificationItem.archiveDate ? this.notificationItem.archiveDate : '' }
    ]).subscribe((notificationReview: NotificationReview) => {
      this.notification = notificationReview;
    });
  }





  mousedown = () => {
    if (this.userProfilePopup) this.userProfilePopup.close();
    if (this.reviewProfilePopup) this.reviewProfilePopup.close();
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




  close(): void {
    // If no notes were written when this form was opened
    if (!this.notification.employees) {

      // And now notes have been written
      if (this.notes.nativeElement.value.trim().length > 0) {
        this.dataService.post('api/Notifications/PostNote', {
          productId: this.notificationItem.productId,
          notificationType: this.notificationItem.type,
          archiveDate: this.notificationItem.archiveDate,
          text: this.notes.nativeElement.value.trim()
        }).subscribe();
      }
    }

    // If this is a new notification and it has NOT been sent to archive yet
    if (this.notificationItem.isNew) {
      // Send it to archive
      this.dataService.put('api/Notifications/Archive',
        {
          productId: this.notificationItem.productId,
          notificationType: this.notificationItem.type
        }).subscribe();
    }

    // Now close
    super.close();
  }







  ngOnDestroy() {
    window.removeEventListener('mousedown', this.mousedown);
  }
}