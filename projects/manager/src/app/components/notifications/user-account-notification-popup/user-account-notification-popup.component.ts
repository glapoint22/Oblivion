import { Component } from '@angular/core';
import { NotificationType, SpinnerAction } from 'common';
import { MenuOptionType } from '../../../classes/enums';
import { MenuOption } from '../../../classes/menu-option';
import { NotificationEmployee } from '../../../classes/notifications/notification-employee';
import { UserAccountNotification } from '../../../classes/notifications/user-account-notification';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';
import { ReformListFormComponent } from '../reform-list-form/reform-list-form.component';
import { ReplaceUserNameFormComponent } from '../replace-user-name-form/replace-user-name-form.component';

@Component({
  templateUrl: './user-account-notification-popup.component.html',
  styleUrls: ['../notification-form/notification-form.component.scss', './user-account-notification-popup.component.scss']
})
export class UserAccountNotificationPopupComponent extends NotificationPopupComponent {
  private dataServicePath!: string;
  private formOpen!: boolean;

  public newNotesAdded: Array<boolean> = new Array<boolean>();
  public notificationType!: NotificationType;
  public NotificationType = NotificationType;
  public notificationName!: string;
  public buttonName!: string;


  // ====================================================================( NG ON INIT )===================================================================== \\

  ngOnInit(): void {
    super.ngOnInit();

    this.onNotificationLoad.subscribe(() => {
      (this.notification as Array<UserAccountNotification>).forEach(x => {
        if (x.employeeNotes.length == 0) x.employeeNotes.push(new NotificationEmployee());
      });
    });

    switch (this.notificationType) {
      case NotificationType.UserName:
        this.buttonName = 'Replace Name';
        this.notificationName = 'User Name';
        this.dataServicePath = 'GetUserNameNotification';
        break;

      case NotificationType.UserImage:
        this.buttonName = 'Remove Image';
        this.notificationName = 'User Image';
        this.dataServicePath = 'GetUserImageNotification';
        break;

      case NotificationType.List:
        this.notificationName = 'List';
        this.buttonName = 'Reform List';
        this.dataServicePath = 'GetListNotification';
        break;

      case NotificationType.Review:
        this.notificationName = 'Review';
        this.buttonName = 'Remove Review';
        this.dataServicePath = 'GetReviewNotification';
        break;
    }

    this.getNotification<Array<UserAccountNotification>>('api/Notifications/' + this.dataServicePath,
      [
        {
          key: 'notificationGroupId',
          value: this.notificationItem.notificationGroupId
        },
        {
          key: 'isNew',
          value: this.notificationItem.isNew
        }
      ]);
  }



  // =============================================================( GET CONTEXT MENU OPTIONS )============================================================== \\

  getContextMenuOptions(): Array<MenuOption> {
    return [
      {
        type: MenuOptionType.MenuItem,
        name: 'Close (Remain as New)',
        hidden: this.notificationItem.isNew ? false : true,
        optionFunction: () => {
          this.onEscape();
        }
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



  // =====================================================================( ADD NOTE )====================================================================== \\

  addNote(employees: Array<NotificationEmployee>) {
    this.newNotesAdded[this.userIndex] = true;
    employees.push(new NotificationEmployee());
    this.notification[this.userIndex].employeeIndex = employees.length - 1;
    window.setTimeout(() => {
      this.notes.nativeElement.focus();
    })
  }



  // ==========================================================( ARE ANY EMPLOYEE NOTES WRITTEN )=========================================================== \\

  areAnyEmployeeNotesWritten() {
    let isWritten: boolean = false;

    for (let i = 0; i < this.notification.length; i++) {
      // If a new reply has been written in any of the messages and they're not just empty spaces
      if (this.isEmployeeNotesWritten(this.notification[i].employeeNotes, this.newNotesAdded[i])) {
        isWritten = true;
        break;
      }
    }
    return isWritten
  }



  // ================================================================( SAVE EMPLOYEE TEXT )================================================================= \\

  saveEmployeeText() {
    this.employeeTextParameters = {
      notificationGroupId: this.notificationItem.notificationGroupId,
      notificationId: this.notification[this.userIndex].notificationId,
      note: this.notification[this.userIndex].employeeNotes[this.notification[this.userIndex].employeeNotes.length - 1].text.trim()
    }
    super.saveEmployeeText();
  }



  // ==============================================================( ON PRIMARY BUTTON CLICK )============================================================== \\

  onPrimaryButtonClick() {
    if (this.notificationItem.isNew) {
      this.onDelete();
      // Update the count for the notification bell
      this.notificationService.notificationCount -= 1;

    } else {

      // If notes were written
      if (this.areAnyEmployeeNotesWritten()) {
        // Then save the new note
        this.saveEmployeeText();
      }
      this.close();
    }
  }


  // ============================================================( OPEN REPLACE USER NAME FORM )============================================================ \\

  openReplaceUserNameForm() {
    this.lazyLoadingService.load(async () => {
      const { ReplaceUserNameFormComponent } = await import('../replace-user-name-form/replace-user-name-form.component');
      const { ReplaceUserNameFormModule } = await import('../replace-user-name-form/replace-user-name-form.module');
      return {
        component: ReplaceUserNameFormComponent,
        module: ReplaceUserNameFormModule
      }
    }, SpinnerAction.None).then((replaceUserNameForm: ReplaceUserNameFormComponent) => {
      this.formOpen = true;
      replaceUserNameForm.notification = this.notification[this.userIndex];
      replaceUserNameForm.callback = () => {
        this.setCallback('api/Notifications/AddNoncompliantStrikeUserName', {
          userId: this.notification[this.userIndex].userId,
          userName: this.notification[this.userIndex].userName
        });
      }

      const replaceUserNameCloseListener = replaceUserNameForm.onClose.subscribe(() => {
        replaceUserNameCloseListener.unsubscribe();
        this.formOpen = false;
      })
    })
  }



  // ============================================================( OPEN REMOVE USER IMAGE FORM )============================================================ \\

  openRemoveUserImageForm() {
    console.log('user image')
  }



  // ===============================================================( OPEN REFORM LIST FORM )=============================================================== \\

  openReformListForm() {
    this.lazyLoadingService.load(async () => {
      const { ReformListFormComponent } = await import('../reform-list-form/reform-list-form.component');
      const { ReformListFormModule } = await import('../reform-list-form/reform-list-form.module');
      return {
        component: ReformListFormComponent,
        module: ReformListFormModule
      }
    }, SpinnerAction.None).then((reformListForm: ReformListFormComponent) => {
      this.formOpen = true;
      reformListForm.notification = this.notification[this.userIndex];
      reformListForm.callback = (reformListOption: number) => {
        this.setCallback('api/Notifications/AddNoncompliantStrikeList', {
          listId: this.notification[this.userIndex].listId,
          option: reformListOption,
          userId: this.notification[this.userIndex].userId
        });
      }

      const reformListCloseListener = reformListForm.onClose.subscribe(() => {
        reformListCloseListener.unsubscribe();
        this.formOpen = false;
      })
    })
  }



  // ==============================================================( OPEN REMOVE REVIEW FORM )============================================================== \\

  openRemoveReviewForm() {
    console.log('review')
  }



  // ===================================================================( SET CALLBACK )==================================================================== \\

  setCallback(dataServicePath: string, dataServiceParameters: object) {
    // Save the notes (if any)
    if (this.areAnyEmployeeNotesWritten()) {
      this.saveEmployeeText();
    }

    // Update the count for the notification bell
    this.notificationService.notificationCount -= 1;

    // Archive the notification
    this.dataService.put('api/Notifications/Archive', {
      notificationGroupId: this.notificationItem.notificationGroupId,
      notificationId: this.notification[this.userIndex].notificationId
    }, {
      authorization: true
    }).subscribe();
    this.notificationService.removeNotification(this.notificationService.newNotifications, this.notificationItem, this);

    // Add the noncompliant strike
    this.dataService.put<boolean>(dataServicePath, dataServiceParameters, {
      authorization: true
    }).subscribe((removalSuccessful: boolean) => {
      if (removalSuccessful) {
        this.notificationService.addToList(this.notificationService.archiveNotifications, 1, this.notificationItem);
      }
    });
  }



  // =====================================================================( ON DELETE )===================================================================== \\

  onDelete() {
    let notificationIds = new Array<number>();

    if (this.notificationType == NotificationType.UserName || this.notificationType == NotificationType.UserImage || !this.notificationItem.isNew) {
      this.notificationService.removeNotification(this.notificationItem.isNew ? this.notificationService.newNotifications : this.notificationService.archiveNotifications, this.notificationItem, this);

      (this.notification as Array<UserAccountNotification>).forEach(x => {
        notificationIds.push(x.notificationId);
      });
    } else {

      notificationIds.push(this.notification[this.userIndex].notificationId);

      if (this.notificationItem.count > 1) {
        // Minus the count for the notification's red circle by one
        this.notificationItem.count -= 1;
        // And then remove the current message from the popup
        this.notification.splice(this.userIndex, 1);
        // Set the counter so that the first message is being displayed (if not already)
        this.userIndex = 0;
      } else {

        this.notificationService.removeNotification(this.notificationService.newNotifications, this.notificationItem, this);
      }
    }


    // Update database
    this.dataService.delete('api/Notifications/DeleteNotifications', {
      notificationGroupId: this.notificationItem.notificationGroupId,
      notificationIds: notificationIds
    }, {
      authorization: true
    }).subscribe();
  }



  // =====================================================================( ON ESCAPE )===================================================================== \\

  onEscape(): void {
    if (!this.contextMenu && this.profilePopupContainer.length == 0 && !this.undoChangesPrompt && !this.secondaryButtonPrompt && !this.deletePrompt && !this.formOpen) {
      if (!this.areAnyEmployeeNotesWritten()) {
        this.close();
      } else {
        this.openUndoChangesPrompt();
      }
    }
  }
}
















// // =========================================================( SECONDARY BUTTON PROMPT FUNCTION )========================================================== \\

  // secondaryButtonPromptFunction() {
  //   // If any notes were written
  //   if (this.areAnyEmployeeNotesWritten()) {
  //     // Then save the new note
  //     this.saveEmployeeText();
  //   }
  //   // Update the count for the notification bell
  //   this.notificationService.notificationCount -= 1;

  //   // Update the database
  //   this.dataService.put('api/Notifications/Archive', {
  //     notificationGroupId: this.notificationItem.notificationGroupId,
  //     notificationId: this.notification[this.userIndex].notificationId
  //   }, {
  //     authorization: true
  //   }).subscribe();

  //   // Update the lists
  //   this.notificationService.removeNotification(this.notificationService.newNotifications, this.notificationItem, this);

  //   // Add a non-compliant strike because of user name
  //   if (this.notificationType == NotificationType.UserName) {
  //     this.dataService.put<boolean>('api/Notifications/AddNoncompliantStrikeUserName', {
  //       userId: this.notification[this.userIndex].userId,
  //       userName: this.notification[this.userIndex].userName
  //     }, {
  //       authorization: true
  //     }).subscribe((removalSuccessful: boolean) => {
  //       if (removalSuccessful) {
  //         this.notificationService.addToList(this.notificationService.archiveNotifications, 1, this.notificationItem);
  //       }
  //     });
  //   }

  //   // Add a non-compliant strike because of image
  //   else if (this.notificationType == NotificationType.UserImage) {
  //     this.dataService.put<boolean>('api/Notifications/AddNoncompliantStrikeUserImage', {
  //       userId: this.notification[this.userIndex].userId,
  //       userImage: this.notification[this.userIndex].userImage
  //     }, {
  //       authorization: true
  //     }).subscribe((removalSuccessful: boolean) => {
  //       if (removalSuccessful) {
  //         this.notificationService.addToList(this.notificationService.archiveNotifications, 1, this.notificationItem);
  //       }
  //     });

  //   } else {

  //     console.log('review')
  //   }
  // }