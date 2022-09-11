import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { NotificationItem } from '../../classes/notification-item';
import { NotificationReview } from '../../classes/notification-review';
import { NotificationProfilePopupUser } from '../../classes/notification-profile-popup-user';
import { NotificationProfilePopupComponent } from '../notification-profile-popup/notification-profile-popup.component';
import { NotificationProfile } from '../../classes/notification-profile';

@Component({
  templateUrl: './review-notification-popup.component.html',
  styleUrls: ['./review-notification-popup.component.scss']
})
export class ReviewNotificationPopupComponent extends LazyLoad {
  public userIndex: number = 0;
  public employeeIndex: number = 0;
  public notification!: NotificationReview;
  public notificationItem!: NotificationItem;
  public profilePopup!: NotificationProfilePopupComponent;
  public reviewProfilePopup!: NotificationProfilePopupComponent;
  public newNoteAdded!: boolean;
  public newNote!: string;

  @ViewChild('notes') notes!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('profileContainer', { read: ViewContainerRef }) profilePopupContainer!: ViewContainerRef;
  @ViewChild('reviewProfileContainer', { read: ViewContainerRef }) reviewProfilePopupContainer!: ViewContainerRef;

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) {
    super(lazyLoadingService)
  }


  ngOnInit() {
    super.ngOnInit();
    window.addEventListener('mousedown', this.mousedown);

    this.dataService.get<NotificationReview>('api/Notifications/Review', [
      { key: 'notificationGroupId', value: this.notificationItem.notificationGroupId }
    ]).subscribe((notificationReview: NotificationReview) => {
      this.notification = notificationReview;
    });
  }





  mousedown = () => {
    if (this.profilePopup) this.profilePopup.close();
    if (this.reviewProfilePopup) this.reviewProfilePopup.close();
  }






  openProfilePopup() {
    if (this.profilePopupContainer.length > 0) {
      this.profilePopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { NotificationProfilePopupComponent } = await import('../notification-profile-popup/notification-profile-popup.component');
      const { NotificationProfilePopupModule } = await import('../notification-profile-popup/notification-profile-popup.module');
      return {
        component: NotificationProfilePopupComponent,
        module: NotificationProfilePopupModule
      }
    }, SpinnerAction.None, this.profilePopupContainer)
      .then((userProfilePopup: NotificationProfilePopupComponent) => {
        this.profilePopup = userProfilePopup;
        userProfilePopup.user = this.notification.users[this.userIndex];
      });
  }



  openReviewProfilePopup() {
    if (this.reviewProfilePopupContainer.length > 0) {
      this.reviewProfilePopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { NotificationProfilePopupComponent } = await import('../notification-profile-popup/notification-profile-popup.component');
      const { NotificationProfilePopupModule } = await import('../notification-profile-popup/notification-profile-popup.module');
      return {
        component: NotificationProfilePopupComponent,
        module: NotificationProfilePopupModule
      }
    }, SpinnerAction.None, this.reviewProfilePopupContainer)
      .then((reviewProfilePopup: NotificationProfilePopupComponent) => {
        this.reviewProfilePopup = reviewProfilePopup;
        reviewProfilePopup.user = this.notification.reviewWriter;
        reviewProfilePopup.isReview = true;
      });
  }





  addNote() {
    this.newNoteAdded = true;
    this.notification.employees.push(new NotificationProfile());
    this.employeeIndex = this.notification.employees.length - 1;
    window.setTimeout(() => {
      this.notes.nativeElement.focus();
    })
  }




  onEscape(): void {
    if (this.profilePopupContainer.length > 0 || this.reviewProfilePopupContainer.length > 0) {
      if (this.profilePopupContainer.length > 0) this.profilePopup.close();
      if (this.reviewProfilePopupContainer.length > 0) this.reviewProfilePopup.close();

    } else {
      this.fade();
    }
  }




  close(): void {
    if (
      // If notes were never writen yet on this form and now
      // for the first time notes are finally being writen
      (this.newNote != null &&
        // and the text area actually has text writen in it
        // and not just empty spaces
        this.newNote.trim().length > 0) ||

      // Or if notes had already been previously writen and the (Add Note) button was pressed
      (this.newNoteAdded &&
        // and the text area actually has text writen in it
        this.notification.employees[this.notification.employees.length - 1].text != null &&
        // and not just empty spaces
        this.notification.employees[this.notification.employees.length - 1].text.trim().length > 0)) {

      // Then save the new note
      this.dataService.post('api/Notifications/PostNote', {
        notificationGroupId: this.notificationItem.notificationGroupId,
        note: this.newNote != null ? this.newNote.trim() : this.notification.employees[this.notification.employees.length - 1].text.trim()
      }).subscribe();
    }

    // If this is a new notification and it has NOT been sent to archive yet
    if (this.notificationItem.isNew) {

      // Send it to archive
      this.dataService.put('api/Notifications/Archive',
        {
          notificationGroupId: this.notificationItem.notificationGroupId
        }).subscribe();
    }

    // Now close
    super.close();
  }







  ngOnDestroy() {
    window.removeEventListener('mousedown', this.mousedown);
  }
}