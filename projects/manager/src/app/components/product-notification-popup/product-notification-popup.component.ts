import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService, LazyLoad, LazyLoadingService, SpinnerAction } from 'common';
import { MenuOptionType } from '../../classes/enums';
import { NotificationItem } from '../../classes/notification-item';
import { NotificationProduct } from '../../classes/notification-product';
import { NotificationProfile } from '../../classes/notification-profile';
import { ContextMenuComponent } from '../../components/context-menu/context-menu.component';
import { PromptComponent } from '../../components/prompt/prompt.component';
import { NotificationService } from '../../services/notification/notification.service';
import { ProductService } from '../../services/product/product.service';
import { NotificationProfilePopupComponent } from '../notification-profile-popup/notification-profile-popup.component';

@Component({
  templateUrl: './product-notification-popup.component.html',
  styleUrls: ['./product-notification-popup.component.scss']
})
export class ProductNotificationPopupComponent extends LazyLoad {
  private isNew!: boolean;
  private contextMenuOpen!: boolean;
  private contextMenu!: ContextMenuComponent

  public userIndex: number = 0;
  public employeeIndex: number = 0;
  public notification!: NotificationProduct;
  public notificationItem!: NotificationItem;
  public profilePopup!: NotificationProfilePopupComponent;
  public newNoteAdded!: boolean;
  public newNote!: string;

  @ViewChild('notes') notes!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('profilePopupContainer', { read: ViewContainerRef }) profilePopupContainer!: ViewContainerRef;

  constructor(lazyLoadingService: LazyLoadingService,
    private dataService: DataService,
    private notificationService: NotificationService,
    private sanitizer: DomSanitizer,
    private productService: ProductService) {
    super(lazyLoadingService)
  }



  ngOnInit() {
    super.ngOnInit();
    window.addEventListener('mousedown', this.mousedown);

    this.dataService.get<NotificationProduct>('api/Notifications/Product', [{ key: 'notificationGroupId', value: this.notificationItem.notificationGroupId }
    ]).subscribe((notificationProduct: NotificationProduct) => {
      this.notification = notificationProduct;
    });
  }




  mousedown = () => {
    if (this.profilePopup) this.profilePopup.close();
  }





  openContextMenu(ellipsis: HTMLElement) {
    if (this.contextMenuOpen) {
      this.contextMenu.close();
      this.contextMenuOpen = false;
      return;
    }
    this.lazyLoadingService.load(async () => {
      const { ContextMenuComponent } = await import('../../components/context-menu/context-menu.component');
      const { ContextMenuModule } = await import('../../components/context-menu/context-menu.module');

      return {
        component: ContextMenuComponent,
        module: ContextMenuModule
      }
    }, SpinnerAction.None).then((contextMenu: ContextMenuComponent) => {
      this.contextMenuOpen = true;
      this.contextMenu = contextMenu;
      contextMenu.xPos = ellipsis.getBoundingClientRect().left + 25;
      contextMenu.yPos = ellipsis.getBoundingClientRect().top + 21;
      contextMenu.parentObj = this;
      contextMenu.options = [
        {
          type: MenuOptionType.MenuItem,
          name: 'Open Product',
          optionFunction: ()=> {
            this.productService.goToProduct(this.notification.productId);
          }
        },
        {
          type: MenuOptionType.MenuItem,
          name: 'Go to Product Website',
          optionFunction: ()=> {
            window.open(this.notification.productHoplink, '_blank');
          }
        },
        {
          type: MenuOptionType.MenuItem,
          name: this.notificationItem.isNew ? 'Archive' : 'Restore as New',
          optionFunction: this.close,
          optionFunctionParameters: [true]
        }
      ]

      const contextMenuOpenListener = contextMenu.menuOpen.subscribe((menuOpen: boolean) => {
        contextMenuOpenListener.unsubscribe();
        this.contextMenuOpen = menuOpen;
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
      .then((profilePopup: NotificationProfilePopupComponent) => {
        this.profilePopup = profilePopup;
        profilePopup.user = this.notification.users[this.userIndex];
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






  openDisableProductPrompt() {
    this.lazyLoadingService.load(async () => {
      const { PromptComponent } = await import('../../components/prompt/prompt.component');
      const { PromptModule } = await import('../../components/prompt/prompt.module');

      return {
        component: PromptComponent,
        module: PromptModule
      }
    }, SpinnerAction.None).then((prompt: PromptComponent) => {
      prompt.parentObj = this;
      prompt.title = (this.notification.productDisabled ? 'Enable' : 'Disable') + ' Product';
      prompt.message = this.sanitizer.bypassSecurityTrustHtml(
        'The product' +
        ' <span style="color: #ffba00">\"' + this.notificationItem.productName + '\"</span>' +
        ' will be ' + (this.notification.productDisabled ? 'enabled' : 'disabled') + '.');
      prompt.primaryButton = {
        name: this.notification.productDisabled ? 'Enable' : 'Disable',
        buttonFunction: this.disableProduct
      }
      prompt.secondaryButton.name = 'Cancel'
    })
  }






  disableProduct() {
    this.notification.productDisabled = !this.notification.productDisabled;

    this.dataService.put('api/Notifications/DisableProduct', {
      productId: this.notification.productId,
      productDisabled: this.notification.productDisabled
    }).subscribe();
  }










  onEscape(): void {
    if (this.profilePopupContainer.length > 0) {
      this.profilePopup.close();
    } else {
      this.fade();
    }
  }







  close(restore?: boolean): void {
    if (
      // If notes were never writen yet on this form and now
      // for the first time notes are finally being writen
      (this.newNote != null &&
        // and the text area actually has text writen in it
        // and not just empty spaces
        this.newNote.trim().length > 0) ||

      // Or if notes had already been previously writen and the (Add Note) button was pressed
      (this.newNoteAdded &&
        // and the text area actually has text writen in it
        this.notification.employees[this.notification.employees.length - 1].text != null &&
        // and not just empty spaces
        this.notification.employees[this.notification.employees.length - 1].text.trim().length > 0)) {

      // Then save the new note
      this.dataService.post('api/Notifications/PostNote', {
        notificationGroupId: this.notificationItem.notificationGroupId,
        note: this.newNote != null ? this.newNote.trim() : this.notification.employees[this.notification.employees.length - 1].text.trim()
      }).subscribe();
    }

    // If this is a new notification and it has NOT been sent to archive yet
    if (this.notificationItem.isNew) {
      this.isNew = false;
      this.notificationService.archiveNotifications.unshift(this.notificationItem)
      this.notificationService.newNotifications.splice(this.notificationItem.index!, 1);
      this.notificationService.notificationCount -= this.notificationItem.count;

      // // Update database
      // this.dataService.put('api/Notifications/Archive',
      //   {
      //     notificationGroupId: this.notificationItem.notificationGroupId
      //   }).subscribe();

    } else if (restore) {
      this.isNew = true;
      this.notificationService.newNotifications.push(this.notificationItem)
      this.notificationService.archiveNotifications.splice(this.notificationItem.index!, 1);
      this.notificationService.notificationCount += this.notificationItem.count;
      this.notificationService.newNotifications.sort((a, b) => (a.creationDate > b.creationDate) ? -1 : 1);

      // // Update database
      // this.dataService.put('api/Notifications/Archive',
      //   {
      //     notificationGroupId: this.notificationItem.notificationGroupId
      //   }).subscribe();
    }




    // Now close
    super.close();
  }





  ngOnDestroy() {
    if (this.isNew != null) this.notificationItem.isNew = this.isNew;
    window.removeEventListener('mousedown', this.mousedown);
  }
}