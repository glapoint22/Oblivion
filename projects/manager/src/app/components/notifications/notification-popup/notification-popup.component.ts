import { KeyValue } from '@angular/common';
import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { Subject } from 'rxjs';
import { MenuOption } from '../../../classes/menu-option';
import { Notification } from '../../../classes/notification';
import { NotificationItem } from '../../../classes/notification-item';
import { NotificationProfile } from '../../../classes/notification-profile';
import { NotificationProfilePopupUser } from '../../../classes/notification-profile-popup-user';
import { NotificationService } from '../../../services/notification/notification.service';
import { ContextMenuComponent } from '../../context-menu/context-menu.component';
import { PromptComponent } from '../../prompt/prompt.component';
import { NotificationProfilePopupComponent } from '../notification-profile-popup/notification-profile-popup.component';

@Component({
  selector: 'app-notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.scss']
})
export class NotificationPopupComponent extends LazyLoad {
  public isNew!: boolean;
  public notificationItem!: NotificationItem;
  public contextMenu!: ContextMenuComponent;
  public profilePopup!: NotificationProfilePopupComponent;
  public newNoteAdded!: boolean;
  public employeeIndex: number = 0;
  public firstNote!: string;
  public secondaryButtonDisabled!: boolean;
  public counterIndex: number = 0;
  public employeeTextPath = '';
  public employeeTextParameters = {};
  public deletePromptTitle: string = 'Delete Notification';
  public undoChangesPrompt!: PromptComponent;
  public deletePromptMessage!: SafeHtml;
  public disableButtonPromptTitle!: string;
  public disableButtonPromptMessage!: SafeHtml;
  public disableButtonPromptPrimaryButtonName!: string;
  public disableButtonPrompt!: PromptComponent;
  public deletePrompt!: PromptComponent;
  public notification!: any;
  public reviewProfilePopup!: NotificationProfilePopupComponent;
  public secondaryButtonDisabledPath!: string;
  public secondaryButtonDisabledParameters!: {};


  @ViewChild('notes') notes!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('profilePopupContainerTemplate', { read: ViewContainerRef }) profilePopupContainer!: ViewContainerRef;
  @ViewChild('reviewProfilePopupContainerTemplate', { read: ViewContainerRef }) reviewProfilePopupContainer!: ViewContainerRef;


  // ====================================================================( CONSTRUCTOR )==================================================================== \\

  constructor(lazyLoadingService: LazyLoadingService,
    public dataService: DataService,
    public notificationService: NotificationService,
    public sanitizer: DomSanitizer) {
    super(lazyLoadingService)
  }



  // ====================================================================( NG ON INIT )===================================================================== \\

  ngOnInit() {
    super.ngOnInit();
    this.notificationItem.selected = false;
    this.notificationItem.selectType = null!;

    this.deletePromptMessage = this.sanitizer.bypassSecurityTrustHtml(
      'The notification,' +
      ' <span style="color: #ffba00">\"' + this.notificationItem.name + '\"</span>' +
      ' will be permanently deleted.');
  }



  // =================================================================( GET NOTIFICATION )================================================================== \\

  getNotification<T>(notificationPath: string, notificationParameters: Array<KeyValue<any, any>>) {
    this.dataService.get<T>(notificationPath, notificationParameters)
      .subscribe((notification: T) => {
        this.notification = notification;
      });
  }



  // =================================================================( OPEN CONTEXT MENU )================================================================= \\

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
      contextMenu.options = this.getContextMenuOptions();

      const contextMenuOpenListener = contextMenu.menuOpen.subscribe((menuOpen: boolean) => {
        contextMenuOpenListener.unsubscribe();
        this.contextMenu = null!;
      })
    });
  }



  // =============================================================( GET CONTEXT MENU OPTIONS )============================================================== \\
  
  getContextMenuOptions(): Array<MenuOption> {
    return [];
  }



  // =====================================================================( ADD NOTE )====================================================================== \\

  addNote(employees: Array<NotificationProfile>) {
    this.newNoteAdded = true;
    employees.push(new NotificationProfile());
    this.employeeIndex = employees.length - 1;
    window.setTimeout(() => {
      this.notes.nativeElement.focus();
    })
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



  // =================================================================( IS NOTE WRITTEN )=================================================================== \\
  
  isNoteWritten(employees: Array<NotificationProfile>): boolean {
    // If notes were never written yet on this form and now
    // for the first time notes are finally being written
    return (this.firstNote != null &&
      // and the text area actually has text written in it
      // and not just empty spaces
      this.firstNote.trim().length > 0) ||

      // Or if notes had already been previously written and the (Add Note) button was pressed
      (this.newNoteAdded &&
        // and the text area actually has text written in it
        employees[employees.length - 1].text != null &&
        // and not just empty spaces
        employees[employees.length - 1].text.trim().length > 0)
  }



  // ================================================================( SEND EMPLOYEE TEXT )================================================================= \\
  
  sendEmployeeText() {
    this.dataService.post(this.employeeTextPath, this.employeeTextParameters).subscribe();
  }



  // ============================================================( OPEN DISABLE BUTTON PROMPT )============================================================= \\

  openDisableButtonPrompt() {
    this.lazyLoadingService.load(async () => {
      const { PromptComponent } = await import('../../prompt/prompt.component');
      const { PromptModule } = await import('../../prompt/prompt.module');

      return {
        component: PromptComponent,
        module: PromptModule
      }
    }, SpinnerAction.None).then((prompt: PromptComponent) => {
      this.disableButtonPrompt = prompt;
      prompt.parentObj = this;
      prompt.title = this.disableButtonPromptTitle;
      prompt.message = this.disableButtonPromptMessage;
      prompt.primaryButton = {
        name: this.disableButtonPromptPrimaryButtonName,
        buttonFunction: () => {
          this.secondaryButtonDisabled = true;
        }
      }
      prompt.secondaryButton.name = 'Cancel'

      const promptCloseListener = prompt.onClose.subscribe(() => {
        promptCloseListener.unsubscribe();
        this.disableButtonPrompt = null!;
      })
    })
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
      prompt.message = 'Any changes you have made will be undone. Do you want to continue closing?';
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



  // ================================================================( OPEN DELETE PROMPT )================================================================= \\

  openDeletePrompt() {
    this.lazyLoadingService.load(async () => {
      const { PromptComponent } = await import('../../prompt/prompt.component');
      const { PromptModule } = await import('../../prompt/prompt.module');

      return {
        component: PromptComponent,
        module: PromptModule
      }
    }, SpinnerAction.None).then((prompt: PromptComponent) => {
      this.deletePrompt = prompt;
      prompt.parentObj = this;
      prompt.title = this.deletePromptTitle;
      prompt.message = this.deletePromptMessage;
      prompt.primaryButton = {
        name: 'Delete',
        buttonFunction: () => {
          this.onDelete();
        }
      }
      prompt.secondaryButton.name = 'Cancel'

      const promptCloseListener = prompt.onClose.subscribe(() => {
        promptCloseListener.unsubscribe();
        this.deletePrompt = null!;
      })
    })
  }



  // =====================================================================( ON DELETE )===================================================================== \\

  onDelete() {
    this.notificationService.archiveNotifications.splice(this.notificationItem.index!, 1);
    const index = this.container.indexOf(this.viewRef);
    this.container.remove(index);

    this.dataService.delete('api/Notifications', {
      notificationGroupId: this.notificationItem.notificationGroupId
    }).subscribe();
  }


  
  // =====================================================================( ON CLOSE )====================================================================== \\

  onClose(employees: Array<NotificationProfile>, restore?: boolean): void {
    // If notes were written
    if (this.isNoteWritten(employees)) {
      // Then save the new note
      this.sendEmployeeText();
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
      this.dataService.put(this.secondaryButtonDisabledPath, this.secondaryButtonDisabledParameters).subscribe();
    }

    // Now close
    super.close();
  }



  // ==================================================================( NG ON DESTROY )==================================================================== \\

  ngOnDestroy() {
    // Update isNew property here so that the primary button isn't being seen changing to other button type as popup closes
    if (this.isNew != null) this.notificationItem.isNew = this.isNew;
  }
}