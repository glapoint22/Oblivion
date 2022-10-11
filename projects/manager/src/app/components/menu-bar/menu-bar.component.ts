import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadingService, SpinnerAction } from 'common';
import { MenuOptionType } from '../../classes/enums';
import { MenuBarButton } from '../../classes/menu-bar-button';
import { NichesSideMenuComponent } from '../niches-side-menu/niches-side-menu.component';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { NotificationService } from '../../services/notification/notification.service';
import { NotificationListPopupComponent } from '../notifications/notification-list-popup/notification-list-popup.component';

@Component({
  selector: 'menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent {
  // Private
  private menuOpen!: boolean;
  private menu!: ContextMenuComponent;
  private nichesSideMenuOpen!: boolean;
  private notificationListPopup!: NotificationListPopupComponent

  // Public
  public notificationCount!: number;
  public selectedMenuBarButton!: MenuBarButton;
  public nichesSideMenu!: NichesSideMenuComponent;
  public menuBarButtons: Array<MenuBarButton> = this.getMenuBarButtons();

  // Decorators
  @ViewChild('notificationListPopupContainer', { read: ViewContainerRef }) notificationListPopupContainer!: ViewContainerRef;
  @ViewChild('notificationPopup', { read: ViewContainerRef }) notificationPopupContainer!: ViewContainerRef;

  // Constructor
  constructor(public lazyLoadingService: LazyLoadingService, private router: Router, private notificationService: NotificationService) { }


  ngOnInit() {
    this.notificationService.onNotificationCount.subscribe((notificationCount) => {
      this.notificationCount = notificationCount;
    });
  }


  ngAfterViewInit() {
    this.notificationService.notificationPopupContainer = this.notificationPopupContainer;
  }



  getMenuBarButtons(): Array<MenuBarButton> {
    return [

      // Builders
      {
        name: 'Builders',
        menuOptions: [
          {
            type: MenuOptionType.MenuItem,
            name: 'Product Builder',
            shortcut: 'Alt+P',
            optionFunction: this.openProductBuilder
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Page Builder',
            shortcut: 'Ctrl+Alt+P',
            optionFunction: this.openPageBuilder
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Email Builder',
            shortcut: 'Shift+E',
            optionFunction: this.openEmailBuilder
          }
        ]
      },



      // Forms
      {
        name: 'Forms',
        menuOptions: [
          {
            type: MenuOptionType.MenuItem,
            name: 'Vendor',
            shortcut: 'Alt+V',
            optionFunction: this.openVendorForm
          },
          {
            type: MenuOptionType.Divider
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Filters',
            shortcut: 'Shift+F',
            optionFunction: this.openFiltersForm
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Keywords',
            shortcut: 'Alt+K',
            optionFunction: this.openKeywordsForm
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Product Groups',
            shortcut: 'Alt+G',
            optionFunction: this.openProductGroupsForm
          },
          {
            type: MenuOptionType.Divider
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Blocked Users',
            shortcut: 'Alt+B',
            optionFunction: this.openBlockedUserForm
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Noncompliant Users',
            shortcut: 'Alt+N',
            optionFunction: this.openNoncompliantUserForm
          }
        ]
      },


      // Edit
      {
        name: 'Edit',
        menuOptions: [
          {
            type: MenuOptionType.MenuItem,
            name: 'Undo',
            shortcut: 'Ctrl+Z'
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Redo',
            shortcut: 'Ctrl+Y'
          },
          {
            type: MenuOptionType.Divider
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Cut',
            shortcut: 'Ctrl+X'
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Copy',
            shortcut: 'Ctrl+C'
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Paste',
            shortcut: 'Ctrl+V'
          }
        ]
      },


      // Account
      {
        name: 'Account',
        menuOptions: [
          {
            type: MenuOptionType.MenuItem,
            name: 'Change Name'
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Change Email'
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Change Password'
          },
          {
            type: MenuOptionType.Divider
          },
          {
            type: MenuOptionType.MenuItem,
            name: 'Sign Out'
          }
        ]
      }
    ]
  }


  onMenuBarButtonOver(htmlMenuBarButton: HTMLElement, menuBarButton: MenuBarButton) {
    if (this.menuOpen && this.selectedMenuBarButton != menuBarButton) {
      this.menu.close();
      this.openMenu(htmlMenuBarButton, menuBarButton);
    }
  }



  onMenuBarButtonDown(htmlMenuBarButton: HTMLElement, menuBarButton: MenuBarButton, e: MouseEvent) {
    if (!this.menuOpen) {
      // Delay in case some other component has a menu open (delaying will prevent stopPropagation from executing and close the menu from the other component first)
      window.setTimeout(() => {
        e.stopPropagation();
        this.openMenu(htmlMenuBarButton, menuBarButton);
      })

    } else {
      this.menu.close();
    }
  }



  async openMenu(htmlMenuBarButton: HTMLElement, menuBarButton: MenuBarButton) {
    this.lazyLoadingService.load(async () => {
      const { ContextMenuComponent } = await import('../../components/context-menu/context-menu.component');
      const { ContextMenuModule } = await import('../../components/context-menu/context-menu.module');

      return {
        component: ContextMenuComponent,
        module: ContextMenuModule
      }
    }, SpinnerAction.None).then((menu: ContextMenuComponent) => {
      this.menu = menu;
      this.menuOpen = true;
      menu.parentObj = this;
      menu.hasCover = true;
      menu.options = menuBarButton.menuOptions;
      this.selectedMenuBarButton = menuBarButton;
      menu.xPos = htmlMenuBarButton.getBoundingClientRect().left;
      menu.yPos = htmlMenuBarButton.getBoundingClientRect().top + htmlMenuBarButton.getBoundingClientRect().height;

      const menuOpenListener = menu.menuOpen.subscribe((menuOpen: boolean) => {
        menuOpenListener.unsubscribe();
        this.menuOpen = menuOpen;
        this.selectedMenuBarButton = null!;
      })
    });
  }







  async openNichesSideMenu() {
    if (!this.nichesSideMenuOpen) {

      if (this.menuOpen) {
        this.menu.close();
      }

      this.lazyLoadingService.load(async () => {
        const { NichesSideMenuComponent } = await import('../niches-side-menu/niches-side-menu.component');
        const { NichesSideMenuModule } = await import('../niches-side-menu/niches-side-menu.module');
        return {
          component: NichesSideMenuComponent,
          module: NichesSideMenuModule
        }
      }, SpinnerAction.None).then((nichesSideMenu: NichesSideMenuComponent) => {
        this.nichesSideMenu = nichesSideMenu;
        this.nichesSideMenuOpen = true;

        const nichesSideMenuOpenListener = nichesSideMenu.nichesSideMenuOpen.subscribe((nichesSideMenuOpen: boolean) => {
          nichesSideMenuOpenListener.unsubscribe();
          this.nichesSideMenuOpen = nichesSideMenuOpen;
        })
      })
    } else {
      this.nichesSideMenu.close();
    }
  }








  openProductBuilder() {
    this.router.navigate(['product-builder']);
  }


  openPageBuilder() {
    this.router.navigate(['page-builder']);

  }


  openEmailBuilder() {
    this.router.navigate(['email-builder']);
  }





  openVendorForm() {
    this.lazyLoadingService.load(async () => {
      const { VendorFormComponent } = await import('../vendor-form/vendor-form.component');
      const { VendorFormModule } = await import('../vendor-form/vendor-form.module');
      return {
        component: VendorFormComponent,
        module: VendorFormModule
      }
    }, SpinnerAction.None)
  }





  openFiltersForm() {
    this.lazyLoadingService.load(async () => {
      const { FiltersFormComponent } = await import('../filters-form/filters-form.component');
      const { FiltersFormModule } = await import('../filters-form/filters-form.module');
      return {
        component: FiltersFormComponent,
        module: FiltersFormModule
      }
    }, SpinnerAction.None)
  }


  openKeywordsForm() {
    this.lazyLoadingService.load(async () => {
      const { KeywordsFormComponent } = await import('../../components/keywords-form/keywords-form.component');
      const { KeywordsFormModule } = await import('../../components/keywords-form/keywords-form.module');
      return {
        component: KeywordsFormComponent,
        module: KeywordsFormModule
      }
    }, SpinnerAction.None)
  }



  openProductGroupsForm() {
    this.lazyLoadingService.load(async () => {
      const { ProductGroupsFormComponent } = await import('../../components/product-groups-form/product-groups-form.component');
      const { ProductGroupsFormModule } = await import('../../components/product-groups-form/product-groups-form.module');
      return {
        component: ProductGroupsFormComponent,
        module: ProductGroupsFormModule
      }
    }, SpinnerAction.None)
  }



  openBlockedUserForm() {
    this.lazyLoadingService.load(async () => {
      const { BlockedUsersFormComponent } = await import('../blocked-users-form/blocked-users-form.component');
      const { BlockedUsersFormModule } = await import('../blocked-users-form/blocked-users-form.module');
      return {
        component: BlockedUsersFormComponent,
        module: BlockedUsersFormModule
      }
    }, SpinnerAction.None)
  }



  openNoncompliantUserForm() {
    this.lazyLoadingService.load(async () => {
      const { NoncompliantUsersFormComponent } = await import('../noncompliant-users-form/noncompliant-users-form.component');
      const { NoncompliantUsersFormModule } = await import('../noncompliant-users-form/noncompliant-users-form.module');
      return {
        component: NoncompliantUsersFormComponent,
        module: NoncompliantUsersFormModule
      }
    }, SpinnerAction.None)
  }



  openNotificationListPopup() {
    // If the notification list popup is already open,
    // then close the notification list popup
    if (this.notificationListPopupContainer.length > 0) {
      this.notificationListPopup.close();
      return;
    }

    // If a notification popup happens to be open when the notification bell is clicked,
    // then close that notification popup, don't open the notification list popup
    if (this.notificationService.notificationPopupContainer.length > 0) {
      this.notificationService.notificationPopup.onEscape();
      return;
    }

    this.lazyLoadingService.load(async () => {
      const { NotificationListPopupComponent: NotificationListPopupComponent } = await import('../notifications/notification-list-popup/notification-list-popup.component');
      const { NotificationListPopupModule: NotificationListPopupModule } = await import('../notifications/notification-list-popup/notification-list-popup.module');
      return {
        component: NotificationListPopupComponent,
        module: NotificationListPopupModule
      }
    }, SpinnerAction.None, this.notificationListPopupContainer)
      .then((notificationListPopup: NotificationListPopupComponent) => {
        this.notificationListPopup = notificationListPopup;
      });
  }
}