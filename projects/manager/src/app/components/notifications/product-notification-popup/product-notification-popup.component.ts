import { Component, ViewChild } from '@angular/core';
import { MenuOptionType } from '../../../classes/enums';
import { NotificationPopupComponent } from '../notification-popup/notification-popup.component';
import { MenuOption } from '../../../classes/menu-option';
import { NotificationEmployee } from '../../../classes/notifications/notification-employee';
import { NotificationItem } from '../../../classes/notifications/notification-item';
import { KeyValue } from '@angular/common';
import { ProductNotification } from '../../../classes/notifications/product-notification';
import { DomSanitizer } from '@angular/platform-browser';
import { LazyLoadingService, DataService, DropdownType, DropdownComponent, SpinnerAction } from 'common';
import { NotificationService } from '../../../services/notification/notification.service';
import { ProductService } from '../../../services/product/product.service';
import { Subject } from 'rxjs';
import { DisableEnableProductFormComponent } from '../disable-enable-product-form/disable-enable-product-form.component';

@Component({
  templateUrl: './product-notification-popup.component.html',
  styleUrls: ['../notification-form/notification-form.component.scss', './product-notification-popup.component.scss']
})
export class ProductNotificationPopupComponent extends NotificationPopupComponent {
  private formOpen!: boolean;
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




  openDisableEnableProductForm() {
    this.lazyLoadingService.load(async () => {
      const { DisableEnableProductFormComponent } = await import('../disable-enable-product-form/disable-enable-product-form.component');
      const { DisableEnableProductFormModule } = await import('../disable-enable-product-form/disable-enable-product-form.module');
      return {
        component: DisableEnableProductFormComponent,
        module: DisableEnableProductFormModule
      }
    }, SpinnerAction.None).then((disableEnableProductForm: DisableEnableProductFormComponent) => {
      this.formOpen = true;
      disableEnableProductForm.notification = this.notification;
      disableEnableProductForm.notificationItem = this.notificationItem;
      disableEnableProductForm.newNoteAdded = this.newNoteAdded;
      disableEnableProductForm.employeeNotes = this.isEmployeeNotesWritten(this.notification.employeeNotes, this.newNoteAdded) ? this.notification.employeeNotes[this.notification.employeeNotes.length - 1].text : '';

      // Callback
      disableEnableProductForm.callback = (employeeNotes: string, newNoteAdded: boolean) => {
        // If the notification resides in the new list
        if (this.notificationItem.isNew) {
          // Update the count for the notification bell
          this.notificationService.notificationCount -= 1;
          // Remove the notification from the new list
          this.notificationService.removeNotification(this.notificationService.newNotifications, this.notificationItem, this);

          // If the notification resides in the archive list
        } else {

          // Just close this popup
          this.close();
        }


        this.dataService.put('api/Notifications/DisableEnableProduct', { productId: this.notificationItem.productId }, {
          authorization: true
        }).subscribe(() => {


          // Archive the notification
          this.dataService.put('api/Notifications/Archive', {
            notificationGroupId: this.notificationItem.notificationGroupId,
            notificationId: this.notificationItem.id
          }, {
            authorization: true
          }).subscribe();

          // If the notification resides in the new list
          if (this.notificationItem.isNew) {
            // Add the notification to the archive list
            this.notificationService.addToList(this.notificationService.archiveNotifications, 1, this.notificationItem);
          }
        });


        // Wait one second to allow this popup to close before the notes from the (Disable/Enable Product) form get assigned.
        // This prevents the notes from being seen appearing into the notes section as popup closes
        window.setTimeout(() => {
          this.notification.employeeNotes[this.notification.employeeNotes.length - 1].text = employeeNotes;

          // Save the notes (if any)
          if (this.isEmployeeNotesWritten(this.notification.employeeNotes, newNoteAdded)) {
            this.saveEmployeeText();
          }
        }, 1000)



      }

      const disableEnableProductFormCloseListener = disableEnableProductForm.onClose.subscribe(() => {
        disableEnableProductFormCloseListener.unsubscribe();
        this.formOpen = false;
      })
    })
  }






  // =====================================================================( ON ESCAPE )===================================================================== \\

  onEscape(): void {
    if (!this.contextMenu && this.profilePopupContainer.length == 0 && !this.notificationItemsDropdown?.dropdownList && !this.undoChangesPrompt && !this.formOpen && !this.deletePrompt && !this.productService.rightClickOnProductTab && !this.productService.productTabContextMenu) {
      if (!this.isEmployeeNotesWritten(this.notification.employeeNotes, this.newNoteAdded)) {
        this.close();
      } else {
        this.openUndoChangesPrompt();
      }
    }
  }



  // =====================================================================( ON CLOSE )====================================================================== \\

  onClose(employees: Array<NotificationEmployee>, restore?: boolean): void {
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