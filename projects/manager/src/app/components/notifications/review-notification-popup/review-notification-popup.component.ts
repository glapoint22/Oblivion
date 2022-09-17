import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { DataService, LazyLoadingService, SpinnerAction } from 'common';
import { NotificationItem } from '../../../classes/notification-item';
import { NotificationReview } from '../../../classes/notification-review';
import { NotificationProfilePopupComponent } from '../notification-profile-popup/notification-profile-popup.component';
import { NotificationProfile } from '../../../classes/notification-profile';
import { MenuOptionType } from '../../../classes/enums';
import { ContextMenuComponent } from '../../context-menu/context-menu.component';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from '../../../services/notification/notification.service';
import { PromptComponent } from '../../prompt/prompt.component';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';

@Component({
  templateUrl: './review-notification-popup.component.html',
  styleUrls: ['./review-notification-popup.component.scss']
})
export class ReviewNotificationPopupComponent extends NotificationPopupComponent {
  private isNew!: boolean;
  private contextMenu!: ContextMenuComponent;

  public userIndex: number = 0;
  public employeeIndex: number = 0;
  public notification!: NotificationReview;
  public notificationItem!: NotificationItem;
  public profilePopup!: NotificationProfilePopupComponent;
  public reviewProfilePopup!: NotificationProfilePopupComponent;
  public newNoteAdded!: boolean;
  public firstNote!: string;
  public secondaryButtonDisabled!: boolean;

  @ViewChild('notes') notes!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('profileContainer', { read: ViewContainerRef }) profilePopupContainer!: ViewContainerRef;
  @ViewChild('reviewProfileContainer', { read: ViewContainerRef }) reviewProfilePopupContainer!: ViewContainerRef;


  public get notesWritten(): boolean {
    // If notes were never written yet on this form and now
    // for the first time notes are finally being written
    return (this.firstNote != null &&
      // and the text area actually has text written in it
      // and not just empty spaces
      this.firstNote.trim().length > 0) ||

      // Or if notes had already been previously written and the (Add Note) button was pressed
      (this.newNoteAdded &&
        // and the text area actually has text written in it
        this.notification.employees[this.notification.employees.length - 1].text != null &&
        // and not just empty spaces
        this.notification.employees[this.notification.employees.length - 1].text.trim().length > 0)
  }


  constructor(lazyLoadingService: LazyLoadingService,
    private dataService: DataService,
    private notificationService: NotificationService,
    private sanitizer: DomSanitizer) {
    super(lazyLoadingService)
  }


  ngOnInit() {
    super.ngOnInit();
    this.notificationItem.selected = false;
    this.notificationItem.selectType = null!;

    this.dataService.get<NotificationReview>('api/Notifications/Review', [
      { key: 'notificationGroupId', value: this.notificationItem.notificationGroupId }
    ]).subscribe((notificationReview: NotificationReview) => {
      this.notification = notificationReview;
    });
  }





  openContextMenu(ellipsis: HTMLElement) {
    if (this.contextMenu) {
      this.contextMenu.close();
      return;
    }
    this.lazyLoadingService.load(async () => {
      const { ContextMenuComponent } = await import('../../context-menu/context-menu.component');
      const { ContextMenuModule } = await import('../../context-menu/context-menu.module');

      return {
        component: ContextMenuComponent,
        module: ContextMenuModule
      }
    }, SpinnerAction.None).then((contextMenu: ContextMenuComponent) => {
      this.contextMenu = contextMenu;
      contextMenu.xPos = ellipsis.getBoundingClientRect().left + 25;
      contextMenu.yPos = ellipsis.getBoundingClientRect().top + 21;
      contextMenu.parentObj = this;
      contextMenu.options = [
        {
          type: MenuOptionType.MenuItem,
          name: 'Restore as New',
          optionFunction: () => {
            this.close(true);
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
            this.openDeleteNotificationPrompt();
          }
        }
      ]

      const contextMenuOpenListener = contextMenu.menuOpen.subscribe((menuOpen: boolean) => {
        contextMenuOpenListener.unsubscribe();
        this.contextMenu = null!;
      })
    });
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




  openRemoveReviewPrompt() {
    this.lazyLoadingService.load(async () => {
      const { PromptComponent } = await import('../../prompt/prompt.component');
      const { PromptModule } = await import('../../prompt/prompt.module');

      return {
        component: PromptComponent,
        module: PromptModule
      }
    }, SpinnerAction.None).then((prompt: PromptComponent) => {
      prompt.parentObj = this;
      prompt.title = (!this.notification.reviewDeleted ? 'Remove' : 'Restore') + ' Review';
      prompt.message = this.sanitizer.bypassSecurityTrustHtml(
        'The review with the title,' +
        ' <span style="color: #ffba00">\"' + this.notification.reviewWriter.reviewTitle + '\"</span>' +
        ' will be ' + (!this.notification.reviewDeleted ? 'removed' : 'restored') + '.');
      prompt.primaryButton = {
        name: !this.notification.reviewDeleted ? 'Remove' : 'Restore',
        buttonFunction: () => {
          this.secondaryButtonDisabled = true;
        }
      }
      prompt.secondaryButton.name = 'Cancel'
    })
  }






  onEscape(): void {
    if (this.profilePopupContainer.length > 0 || this.reviewProfilePopupContainer.length > 0) {
      if (this.profilePopupContainer.length > 0) this.profilePopup.close();
      if (this.reviewProfilePopupContainer.length > 0) this.reviewProfilePopup.close();

    } else {

      if (!this.contextMenu) {
        if (!this.notesWritten && !this.secondaryButtonDisabled) {
          this.fade();
        } else {
          this.openUndoChangesPrompt();
        }
      }
    }
  }



  openUndoChangesPrompt() {
    this.lazyLoadingService.load(async () => {
      const { PromptComponent } = await import('../../prompt/prompt.component');
      const { PromptModule } = await import('../../prompt/prompt.module');

      return {
        component: PromptComponent,
        module: PromptModule
      }
    }, SpinnerAction.None).then((prompt: PromptComponent) => {
      prompt.parentObj = this;
      prompt.title = 'Warning';
      prompt.message = 'Any changes you have made will be undone. Do you want to continue closing?';
      prompt.primaryButton = {
        name: 'Continue',
        buttonFunction: this.fade
      }
      prompt.secondaryButton.name = 'Cancel'
    })
  }




  openDeleteNotificationPrompt() {
    this.lazyLoadingService.load(async () => {
      const { PromptComponent } = await import('../../prompt/prompt.component');
      const { PromptModule } = await import('../../prompt/prompt.module');

      return {
        component: PromptComponent,
        module: PromptModule
      }
    }, SpinnerAction.None).then((prompt: PromptComponent) => {
      prompt.parentObj = this;
      prompt.title = 'Delete Notification';
      prompt.message = this.sanitizer.bypassSecurityTrustHtml(
        'The notification,' +
        ' <span style="color: #ffba00">\"' + this.notificationItem.name + '\"</span>' +
        ' will be permanently deleted.');
      prompt.primaryButton = {
        name: 'Delete',
        buttonFunction: this.deleteNotification
      }
      prompt.secondaryButton.name = 'Cancel'
    })
  }



  deleteNotification() {
    this.notificationService.archiveNotifications.splice(this.notificationItem.index!, 1);
    const index = this.container.indexOf(this.viewRef);
    this.container.remove(index);

    this.dataService.delete('api/Notifications', {
      notificationGroupId: this.notificationItem.notificationGroupId
    }).subscribe();
  }





  close(restore?: boolean): void {
    // If notes were written
    if (this.notesWritten) {
      // Then save the new note
      this.dataService.post('api/Notifications/PostNote', {
        notificationGroupId: this.notificationItem.notificationGroupId,
        note: this.firstNote != null ? this.firstNote.trim() : this.notification.employees[this.notification.employees.length - 1].text.trim()
      }).subscribe();
    }

    // If this is a new notification and it has NOT been sent to archive yet
    if (this.notificationItem.isNew) {
      this.isNew = false;
      this.notificationService.archiveNotifications.unshift(this.notificationItem)
      this.notificationService.newNotifications.splice(this.notificationItem.index!, 1);
      this.notificationService.notificationCount -= this.notificationItem.count;

      // Update database
      this.dataService.put('api/Notifications/Archive',
        {
          notificationGroupId: this.notificationItem.notificationGroupId
        }).subscribe();

    } else if (restore) {
      this.isNew = true;
      this.notificationService.newNotifications.push(this.notificationItem)
      this.notificationService.archiveNotifications.splice(this.notificationItem.index!, 1);
      this.notificationService.notificationCount += this.notificationItem.count;
      this.notificationService.newNotifications.sort((a, b) => (a.creationDate > b.creationDate) ? -1 : 1);

      // Update database
      this.dataService.put('api/Notifications/Archive',
        {
          notificationGroupId: this.notificationItem.notificationGroupId,
          restore: true
        }).subscribe();
    }


    if (this.secondaryButtonDisabled) {
      this.dataService.put('api/Notifications/RemoveReview', {
        reviewId: this.notification.reviewId
      }).subscribe();
    }

    // Now close
    super.close();
  }




  ngOnDestroy() {
    // Update isNew property here so that the primary button isn't being seen changing to other button type as popup closes
    if (this.isNew != null) this.notificationItem.isNew = this.isNew;
  }
}