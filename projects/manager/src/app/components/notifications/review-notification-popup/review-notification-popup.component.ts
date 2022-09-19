import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { SpinnerAction } from 'common';
import { NotificationReview } from '../../../classes/notification-review';
import { NotificationProfilePopupComponent } from '../notification-profile-popup/notification-profile-popup.component';
import { MenuOptionType } from '../../../classes/enums';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';
import { MenuOption } from '../../../classes/menu-option';

@Component({
  templateUrl: './review-notification-popup.component.html',
  styleUrls: ['./review-notification-popup.component.scss']
})
export class ReviewNotificationPopupComponent extends NotificationPopupComponent {
  public reviewProfilePopup!: NotificationProfilePopupComponent;



  @ViewChild('profileContainer', { read: ViewContainerRef }) profilePopupContainer!: ViewContainerRef;
  @ViewChild('reviewProfileContainer', { read: ViewContainerRef }) reviewProfilePopupContainer!: ViewContainerRef;








  ngOnInit() {
    super.ngOnInit();
    this.getNotification<NotificationReview>('api/Notifications/Review', [{ key: 'notificationGroupId', value: this.notificationItem.notificationGroupId }]);
  }




  sendEmployeeText() {
    this.employeeTextPath = 'api/Notifications/PostNote';
    this.employeeTextParameters = {
      notificationGroupId: this.notificationItem.notificationGroupId,
      note: this.firstNote != null ? this.firstNote.trim() : this.notification.employees[this.notification.employees.length - 1].text.trim()
    }
    super.sendEmployeeText();
  }





  getContextMenuOptions(): Array<MenuOption> {
    return [
      {
        type: MenuOptionType.MenuItem,
        name: 'Restore as New',
        optionFunction: () => {
          this.onClose(this.notification.employees, true);
        }
      },
      {
        type: MenuOptionType.Divider,
        hidden: this.notificationItem.isNew ? true : false
      },
      {
        type: MenuOptionType.MenuItem,
        name: 'Delete',
        hidden: this.notificationItem.isNew ? true : false,
        optionFunction: () => {
          this.openDeletePrompt();
        }
      }
    ];
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










  openNotificationPrompt() {
    this.notificationPromptPrimaryButtonName = !this.notification.reviewDeleted ? 'Remove' : 'Restore';
    this.notificationPromptTitle = (!this.notification.reviewDeleted ? 'Remove' : 'Restore') + ' Review';
    this.notificationPromptMessage = this.sanitizer.bypassSecurityTrustHtml(
      'The review with the title,' +
      ' <span style="color: #ffba00">\"' + this.notification.reviewWriter.reviewTitle + '\"</span>' +
      ' will be ' + (!this.notification.reviewDeleted ? 'removed' : 'restored') + '.');


    super.openNotificationPrompt();
  }











  onEscape(): void {
    if (!this.contextMenu && this.profilePopupContainer.length == 0 && this.reviewProfilePopupContainer.length == 0 && !this.undoChangesPrompt && !this.notificationPrompt && !this.deletePrompt) {
      if (!this.notesWritten(this.notification.employees) && !this.secondaryButtonDisabled) {
        this.fade();
      } else {
        this.openUndoChangesPrompt(this.fade);
      }
    }
  }





  onDisabledSecondaryButton() {
    this.dataService.put('api/Notifications/RemoveReview', {
      reviewId: this.notification.reviewId
    }).subscribe();
  }












  ngOnDestroy() {
    // Update isNew property here so that the primary button isn't being seen changing to other button type as popup closes
    if (this.isNew != null) this.notificationItem.isNew = this.isNew;
  }
}