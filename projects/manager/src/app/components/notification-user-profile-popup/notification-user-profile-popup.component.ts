import { Component } from '@angular/core';
import { LazyLoad } from 'common';
import { NotificationUser } from '../../classes/notification-user';

@Component({
  templateUrl: './notification-user-profile-popup.component.html',
  styleUrls: ['./notification-user-profile-popup.component.scss']
})
export class NotificationUserProfilePopupComponent extends LazyLoad {
  public user!: NotificationUser;
  public isReview!: boolean;

  ngOnInit() {
    super.ngOnInit();

    this.user.blockNotificationSending = false;
  }
 }