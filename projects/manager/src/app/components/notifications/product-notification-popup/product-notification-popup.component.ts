import { Component } from '@angular/core';
import { MenuOptionType } from '../../../classes/enums';
import { NotificationProduct } from '../../../classes/notification-product';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';
import { MenuOption } from '../../../classes/menu-option';
import { NotificationEmployee } from '../../../classes/notification-employee';
import { NotificationItem } from '../../../classes/notification-item';
import { KeyValue } from '@angular/common';

@Component({
  templateUrl: './product-notification-popup.component.html',
  styleUrls: ['../notification-popup/notification-popup.component.scss', './product-notification-popup.component.scss']
})
export class ProductNotificationPopupComponent extends NotificationPopupComponent {
  public fromProduct!: boolean;
  public notificationItems!: Array<NotificationItem>;
  public notificationItemDropdownList: Array<KeyValue<string, number>> = [];
  public selectedNotificationItem!: KeyValue<string, number>;


  // ====================================================================( NG ON INIT )===================================================================== \\

  ngOnInit() {
    this.initialize();
    super.ngOnInit();
    this.getProductNotification();


    this.onNotificationLoad.subscribe(() => {
      if (this.notification.employees.length == 0) this.notification.employees.push(new NotificationEmployee());
    });
  }



  // ====================================================================( INITIALIZE )===================================================================== \\

  initialize() {
    // Regardless of where this popup is being opened from (notification list or product)
    // if this popup has a list of notification items, do the following:
    if (this.notificationItems) {
      // Iterate through each notification item in the list
      this.notificationItems.forEach((x, index) => {
        // Assign the name to the notification item based on its notification type
        x.name = this.notificationService.getNotificationName(x.notificationType);

        // If the notification items list is greater than one
        if (this.notificationItems.length > 1) {
          // Convert that list of notification items to a dropdown list
          this.notificationItemDropdownList.push({ key: this.notificationService.getNotificationName(x.notificationType), value: index })
        }
      })
    }

    // If this popup is being opened from a product (NOT from the notification list)
    if (!this.notificationItem) {
      // Assign the notification item from the first notification item in the notification item list
      this.notificationItem = this.notificationItems[0];

      // If the notification items list is greater than one
      if (this.notificationItems.length > 1) {
        // Assign the 'selectedNotificationItem' for the dropdown by using the first notification item in the notification item list
        this.selectedNotificationItem = this.notificationItemDropdownList[0];
      }

      // If this popup is being opened from the notification list
    } else {

      // And if this popup has a list of notification items
      if (this.notificationItems) {
        this.selectNotificationType(this.notificationItem);
      }
    }
  }



  // =============================================================( GET PRODUCT NOTIFICATION )============================================================== \\

  getProductNotification(notificationItem?: NotificationItem) {
    // Update the notification item if the dropdown was selected
    if (notificationItem) this.notificationItem = notificationItem!;
    this.getNotification<NotificationProduct>('api/Notifications/Product', [{ key: 'notificationGroupId', value: this.notificationItem.notificationGroupId }]);
  }



  // =============================================================( SELECT NOTIFICATION TYPE )============================================================== \\

  selectNotificationType(notificationItem: NotificationItem, getProductNotification?: boolean) {
    // If the notification items list is greater than one
    if (this.notificationItems.length > 1) {
      // Have the dropdown select the notification type in its dropdown list that's the same as the notification type that was selected from the notification list
      const index = this.notificationItems.findIndex(x => x.notificationType == notificationItem.notificationType);
      this.selectedNotificationItem = this.notificationItemDropdownList[index];
      if (getProductNotification) this.getProductNotification(notificationItem);
    }
  }



  // =============================================================( GET CONTEXT MENU OPTIONS )============================================================== \\

  getContextMenuOptions(): Array<MenuOption> {
    return [
      {
        type: MenuOptionType.MenuItem,
        name: 'Go to Product Website',
        hidden: this.fromProduct,
        optionFunction: () => {
          window.open(this.notification.productHoplink, '_blank');
        }
      },
      {
        type: MenuOptionType.MenuItem,
        name: this.notificationItem.isNew ? 'Close (Remain as New)' : 'Restore as New',
        optionFunction: () => {
          this.notificationItem.isNew ? this.onEscape() : this.onClose(this.notification.employees, true);
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



  // ================================================================( SAVE EMPLOYEE TEXT )================================================================= \\

  saveEmployeeText() {
    this.employeeTextParameters = {
      notificationGroupId: this.notificationItem.notificationGroupId,
      note: this.notification.employees[this.notification.employees.length - 1].text.trim()
    }
    super.saveEmployeeText();
  }



  // ============================================================( OPEN DISABLE BUTTON PROMPT )============================================================= \\

  openSecondaryButtonPrompt() {
    this.secondaryButtonPromptPrimaryButtonName = this.notification.productDisabled ? 'Enable' : 'Disable';
    this.secondaryButtonPromptTitle = (this.notification.productDisabled ? 'Enable' : 'Disable') + ' Product';
    this.secondaryButtonPromptMessage = this.sanitizer.bypassSecurityTrustHtml(
      'The product,' +
      ' <span style="color: #ffba00">\"' + this.notificationItem.productName + '\"</span>' +
      ' will be ' + (this.notification.productDisabled ? 'enabled' : 'disabled') + '.');

    super.openSecondaryButtonPrompt();
  }



  // =====================================================================( ON ESCAPE )===================================================================== \\

  onEscape(): void {
    if (!this.contextMenu && this.profilePopupContainer.length == 0 && !this.undoChangesPrompt && !this.secondaryButtonPrompt && !this.deletePrompt) {
      if (!this.isEmployeeNotesWritten(this.notification.employees, this.newNoteAdded) && !this.secondaryButtonDisabled) {
        this.close();
      } else {
        this.openUndoChangesPrompt();
      }
    }
  }



  // =====================================================================( ON CLOSE )====================================================================== \\

  onClose(employees: Array<NotificationEmployee>, restore?: boolean): void {
    this.secondaryButtonDisabledPath = 'api/Notifications/DisableProduct';
    this.secondaryButtonDisabledParameters = { productId: this.notificationItem.productId };
    super.onClose(employees, restore);
  }



  // ==================================================================( NG ON DESTROY )==================================================================== \\

  ngOnDestroy() {
    super.ngOnDestroy();
    if (this.notificationItems) {
      // Update isNew property here so that the primary button isn't being seen changing to other button type as popup closes
      if (this.isNew != null) {
        const index = this.notificationItems.findIndex(x => x.notificationType == this.notificationItem.notificationType);
        this.notificationItems[index].isNew = this.notificationItem.isNew;
      }
    }
  }
}