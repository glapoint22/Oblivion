import { Component } from '@angular/core';
import { MenuOptionType } from '../../../classes/enums';
import { NotificationProduct } from '../../../classes/notification-product';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';
import { MenuOption } from '../../../classes/menu-option';

@Component({
  templateUrl: './product-notification-popup.component.html',
  styleUrls: ['./product-notification-popup.component.scss']
})
export class ProductNotificationPopupComponent extends NotificationPopupComponent {




















  ngOnInit() {
    super.ngOnInit();
    this.getNotification<NotificationProduct>('api/Notifications/Product', [{ key: 'notificationGroupId', value: this.notificationItem.notificationGroupId }]);
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
        name: 'Go to Product Website',
        optionFunction: () => {
          window.open(this.notification.productHoplink, '_blank');
        }
      },
      {
        type: MenuOptionType.MenuItem,
        name: this.notificationItem.isNew ? 'Archive' : 'Restore as New',
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








  openNotificationPrompt() {
    this.notificationPromptPrimaryButtonName = this.notification.productDisabled ? 'Enable' : 'Disable';
    this.notificationPromptTitle = (this.notification.productDisabled ? 'Enable' : 'Disable') + ' Product';
    this.notificationPromptMessage = this.sanitizer.bypassSecurityTrustHtml(
      'The product,' +
      ' <span style="color: #ffba00">\"' + this.notificationItem.productName + '\"</span>' +
      ' will be ' + (this.notification.productDisabled ? 'enabled' : 'disabled') + '.');

      super.openNotificationPrompt();
  }

















  onEscape(): void {
    if (!this.contextMenu && this.profilePopupContainer.length == 0 && !this.undoChangesPrompt && !this.notificationPrompt && !this.deletePrompt) {
      if (!this.notesWritten(this.notification.employees) && !this.secondaryButtonDisabled) {
        this.fade();
      } else {
        this.openUndoChangesPrompt(this.fade);
      }
    }
  }









  onDisabledSecondaryButton() {
    this.dataService.put('api/Notifications/DisableProduct', {
      productId: this.notification.productId
    }).subscribe();
  }













  ngOnDestroy() {
    // Update isNew property here so that the primary button isn't being seen changing to other button type as popup closes
    if (this.isNew != null) this.notificationItem.isNew = this.isNew;
  }
}