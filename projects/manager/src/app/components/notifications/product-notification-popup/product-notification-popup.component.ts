import { Component, ViewChild } from '@angular/core';
import { MenuOptionType } from '../../../classes/enums';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';
import { MenuOption } from '../../../classes/menu-option';
import { NotificationEmployee } from '../../../classes/notifications/notification-employee';
import { NotificationItem } from '../../../classes/notifications/notification-item';
import { KeyValue } from '@angular/common';
import { ProductNotification } from '../../../classes/notifications/product-notification';
import { DomSanitizer } from '@angular/platform-browser';
import { LazyLoadingService, DataService, DropdownType, DropdownComponent } from 'common';
import { NotificationService } from '../../../services/notification/notification.service';
import { ProductService } from '../../../services/product/product.service';
import { Subject } from 'rxjs';

@Component({
  templateUrl: './product-notification-popup.component.html',
  styleUrls: ['../notification-form/notification-form.component.scss', './product-notification-popup.component.scss']
})
export class ProductNotificationPopupComponent extends NotificationPopupComponent {
  public fromProduct!: boolean;
  public DropdownType = DropdownType;
  public notificationItems!: Array<NotificationItem>;
  public onPopupClose: Subject<void> = new Subject<void>();
  public selectedNotificationItem!: KeyValue<string, number>;
  public notificationItemDropdownList: Array<KeyValue<string, number>> = [];
  @ViewChild('notificationItemsDropdown') notificationItemsDropdown!: DropdownComponent;


  // ====================================================================( CONSTRUCTOR )==================================================================== \\

  constructor(lazyLoadingService: LazyLoadingService,
    dataService: DataService,
    notificationService: NotificationService,
    sanitizer: DomSanitizer,
    private productService: ProductService) {
    super(lazyLoadingService, dataService, notificationService, sanitizer);
  }


  // ====================================================================( NG ON INIT )===================================================================== \\

  ngOnInit() {
    this.initialize();
    super.ngOnInit();
    this.getProductNotification();
    window.addEventListener('mousedown', this.mousedown);

    this.onNotificationLoad.subscribe(() => {
      if (this.notification.employeeNotes.length == 0) this.notification.employeeNotes.push(new NotificationEmployee());
    });
  }



  // =====================================================================( MOUSEDOWN )===================================================================== \\

  mousedown = () => {
    this.onEscape();
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
    this.getNotification<ProductNotification>('api/Notifications/GetProductNotification', [{ key: 'notificationGroupId', value: this.notificationItem.notificationGroupId }]);
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
          this.notificationItem.isNew ? this.onEscape() : this.onClose(this.notification.employeeNotes, true);
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
      note: this.notification.employeeNotes[this.notification.employeeNotes.length - 1].text.trim()
    }
    super.saveEmployeeText();
  }



  // ===========================================================( OPEN SECONDARY BUTTON PROMPT )============================================================ \\

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
    if (!this.contextMenu && this.profilePopupContainer.length == 0 && !this.notificationItemsDropdown?.dropdownList && !this.undoChangesPrompt && !this.secondaryButtonPrompt && !this.deletePrompt && !this.productService.rightClickOnProductTab && !this.productService.productTabContextMenu) {
      if (!this.isEmployeeNotesWritten(this.notification.employeeNotes, this.newNoteAdded) && !this.secondaryButtonDisabled) {
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



  // ======================================================================( CLOSE )======================================================================== \\

  close(): void {
    super.close();
    this.onPopupClose.next();
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
    window.removeEventListener('mousedown', this.mousedown);
  }
}