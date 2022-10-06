import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { NotificationProfilePopupUser } from '../../../classes/notifications/notification-profile-popup-user';
import { NotificationService } from '../../../services/notification/notification.service';
import { PromptComponent } from '../../prompt/prompt.component';
import { NotificationProfilePopupComponent } from '../notification-profile-popup/notification-profile-popup.component';

@Component({
  selector: 'app-notification-form',
  templateUrl: './notification-form.component.html',
  styleUrls: ['./notification-form.component.scss']
})
export class NotificationFormComponent extends LazyLoad{
  public profilePopup!: NotificationProfilePopupComponent;
  public reviewProfilePopup!: NotificationProfilePopupComponent;
  public undoChangesPrompt!: PromptComponent;

  @ViewChild('profilePopupContainerTemplate', { read: ViewContainerRef }) profilePopupContainer!: ViewContainerRef;



  // ====================================================================( CONSTRUCTOR )==================================================================== \\

  constructor(lazyLoadingService: LazyLoadingService,
    public dataService: DataService,
    public notificationService: NotificationService,
    public sanitizer: DomSanitizer) {
    super(lazyLoadingService)
  }


  // ================================================================( OPEN PROFILE POPUP )================================================================= \\

  openProfilePopup(user: NotificationProfilePopupUser, container: ViewContainerRef, isReview?: boolean) {
    if (container.length > 0) {
      !isReview ? this.profilePopup.close() : this.reviewProfilePopup.close();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { NotificationProfilePopupComponent } = await import('../notification-profile-popup/notification-profile-popup.component');
      const { NotificationProfilePopupModule } = await import('../notification-profile-popup/notification-profile-popup.module');
      return {
        component: NotificationProfilePopupComponent,
        module: NotificationProfilePopupModule
      }
    }, SpinnerAction.None, container)
      .then((profilePopup: NotificationProfilePopupComponent) => {
        !isReview ? this.profilePopup = profilePopup : this.reviewProfilePopup = profilePopup;
        profilePopup.user = user;
        profilePopup.isReview = isReview!;
      });
  }



  // =============================================================( OPEN UNDO CHANGES PROMPT )============================================================== \\
  
  openUndoChangesPrompt() {
    this.lazyLoadingService.load(async () => {
      const { PromptComponent } = await import('../../prompt/prompt.component');
      const { PromptModule } = await import('../../prompt/prompt.module');

      return {
        component: PromptComponent,
        module: PromptModule
      }
    }, SpinnerAction.None).then((prompt: PromptComponent) => {
      this.undoChangesPrompt = prompt;
      prompt.parentObj = this;
      prompt.title = 'Warning';
      prompt.message = 'The changes you have made will NOT be saved. Do you still want to continue closing?';
      prompt.primaryButton = {
        name: 'Continue',
        buttonFunction: this.close
      }
      prompt.secondaryButton.name = 'Cancel'

      const promptCloseListener = prompt.onClose.subscribe(() => {
        promptCloseListener.unsubscribe();
        this.undoChangesPrompt = null!;
      })
    })
  }

  
}