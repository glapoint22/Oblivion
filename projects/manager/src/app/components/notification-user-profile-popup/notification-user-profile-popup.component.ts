import { Component } from '@angular/core';
import { LazyLoad } from 'common';
import { NotificationProfilePopupUser } from '../../classes/notification-profile-popup-user';

@Component({
  templateUrl: './notification-user-profile-popup.component.html',
  styleUrls: ['./notification-user-profile-popup.component.scss']
})
export class NotificationUserProfilePopupComponent extends LazyLoad {
  public user!: NotificationProfilePopupUser;
  public isReview!: boolean;

  ngOnInit() {
    super.ngOnInit();

    this.user.blockNotificationSending = false;
  }
 }