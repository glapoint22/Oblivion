import { KeyValue } from '@angular/common';
import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { SpinnerAction } from 'common';
import { MenuOption } from '../../../classes/menu-option';
import { NotificationItem } from '../../../classes/notifications/notification-item';
import { NotificationEmployee } from '../../../classes/notifications/notification-employee';
import { ContextMenuComponent } from '../../context-menu/context-menu.component';
import { PromptComponent } from '../../prompt/prompt.component';
import { Subject } from 'rxjs';
import { NotificationFormComponent } from '../notification-form/notification-form.component';

@Component({
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.scss']
})
export class NotificationPopupComponent extends NotificationFormComponent {
  public isNew!: boolean;
  public notificationItem!: NotificationItem;
  public contextMenu!: ContextMenuComponent;
  public newNoteAdded!: boolean;
  public employeeIndex!: number;
  public firstNote!: string;
  public userIndex!: number;
  public employeeTextPath = 'api/Notifications/PostNote';
  public employeeTextParameters = {};
  public deletePromptTitle: string = 'Delete Notification';
  public deletePromptMessage!: SafeHtml;
  public deletePrompt!: PromptComponent;
  public notification!: any;
  public onNotificationLoad: Subject<void> = new Subject<void>();

  @ViewChild('notes') notes!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('reviewProfilePopupContainerTemplate', { read: ViewContainerRef }) reviewProfilePopupContainer!: ViewContainerRef;


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
    this.dataService.get<T>(notificationPath, notificationParameters, {
      authorization: true
    }).subscribe((notification: T) => {
      this.userIndex = 0;
      this.employeeIndex = 0;
      this.notification = notification;
      this.onNotificationLoad.next();
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

  addNote(employees: Array<NotificationEmployee>) {
    this.newNoteAdded = true;
    employees.push(new NotificationEmployee());
    this.employeeIndex = employees.length - 1;
    window.setTimeout(() => {
      this.notes.nativeElement.focus();
    })
  }







  // ============================================================( IS EMPLOYEE NOTES WRITTEN )============================================================== \\

  isEmployeeNotesWritten(employees: Array<NotificationEmployee>, newNoteAdded: boolean): boolean {
    // If notes were never written yet on this form and now
    // for the first time notes are finally being written
    return (!employees[0].firstName &&


      employees[0].text != null &&
      // and not just empty spaces
      employees[0].text.trim().length > 0


    ) ||

      // Or if notes had already been previously written and the (Add Note) button was pressed
      (newNoteAdded &&
        // and the text area actually has text written in it
        employees[employees.length - 1].text != null &&
        // and not just empty spaces
        employees[employees.length - 1].text.trim().length > 0


      )
  }



  // ================================================================( SAVE EMPLOYEE TEXT )================================================================= \\

  saveEmployeeText() {
    this.dataService.post(this.employeeTextPath, this.employeeTextParameters, {
      authorization: true
    }).subscribe();
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
      notificationGroupId: this.notificationItem.notificationGroupId,
      notificationIds: [this.notificationItem.id]
    }, {
      authorization: true
    }).subscribe();
  }



  // =====================================================================( ON CLOSE )====================================================================== \\

  onClose(employees: Array<NotificationEmployee>, restore?: boolean): void {
    // If notes were written
    if (this.isEmployeeNotesWritten(employees, this.newNoteAdded)) {
      // Then save the new note
      this.saveEmployeeText();
    }

    // If this is a new notification and it has NOT been sent to archive yet
    if (this.notificationItem.isNew) {
      this.isNew = false;
      this.notificationService.archiveNotifications.unshift(this.notificationItem)
      this.notificationService.newNotifications.splice(this.notificationItem.index!, 1);
      this.notificationService.notificationCount -= this.notificationItem.count;

      // Update database
      this.dataService.put('api/Notifications/ArchiveGroup',
        {
          notificationGroupId: this.notificationItem.notificationGroupId
        }, {
        authorization: true
      }).subscribe();

    } else if (restore) {
      this.isNew = true;
      this.notificationService.newNotifications.push(this.notificationItem)
      this.notificationService.archiveNotifications.splice(this.notificationItem.index!, 1);
      this.notificationService.notificationCount += this.notificationItem.count;
      this.notificationService.newNotifications.sort((a, b) => (a.creationDate > b.creationDate) ? -1 : 1);

      // Update database
      this.dataService.put('api/Notifications/RestoreGroup',
        {
          notificationGroupId: this.notificationItem.notificationGroupId
        }, {
        authorization: true
      }).subscribe();
    }

    // Now close
    super.close();
  }


  // ====================================================================( GET DATE )======================================================================= \\
  getDate(date: string) {
    return new Date(date + 'Z');
  }


  // ==================================================================( NG ON DESTROY )==================================================================== \\

  ngOnDestroy() {
    super.ngOnDestroy();
    // Update isNew property here so that the primary button isn't being seen changing to other button type as popup closes
    if (this.isNew != null) this.notificationItem.isNew = this.isNew;
  }
}