import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { NotificationItem } from '../../classes/notification-item';
import { NotificationProduct } from '../../classes/notification-product';
import { NotificationProfile } from '../../classes/notification-profile';
import { NotificationUserProfilePopupComponent } from '../notification-user-profile-popup/notification-user-profile-popup.component';

@Component({
  templateUrl: './product-notification-popup.component.html',
  styleUrls: ['./product-notification-popup.component.scss']
})
export class ProductNotificationPopupComponent extends LazyLoad {
  public userIndex: number = 0;
  public employeeIndex: number = 0;
  public notification!: NotificationProduct;
  public notificationItem!: NotificationItem;
  public notificationUserProfilePopup!: NotificationUserProfilePopupComponent;
  public newNoteAdded!: boolean;
  public newNote!: string;

  @ViewChild('notes') notes!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('profilePopupContainer', { read: ViewContainerRef }) profilePopupContainer!: ViewContainerRef;

  constructor(lazyLoadingService: LazyLoadingService, private dataService: DataService) {
    super(lazyLoadingService)
  }



  ngOnInit() {
    super.ngOnInit();
    window.addEventListener('mousedown', this.mousedown);

    this.dataService.get<NotificationProduct>('api/Notifications/Product', [
      { key: 'notificationGroupId', value: this.notificationItem.notificationGroupId }
    ]).subscribe((notificationProduct: NotificationProduct) => {
      this.notification = notificationProduct;
    });
  }




  mousedown = () => {
    if (this.notificationUserProfilePopup) this.notificationUserProfilePopup.close();
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




  addNote() {
    this.newNoteAdded = true;
    this.notification.employees.push(new NotificationProfile());
    this.employeeIndex = this.notification.employees.length - 1;
    window.setTimeout(() => {
      this.notes.nativeElement.focus();
    })
  }






  onEscape(): void {
    if (this.profilePopupContainer.length > 0) {
      this.notificationUserProfilePopup.close();
    } else {
      this.fade();
    }
  }






  close(): void {
    if (
      // If notes were never writen yet on this form and now
      // notes are finally being writen for the first time
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