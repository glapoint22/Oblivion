import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadingService, SpinnerAction } from 'common';
import { Subscription } from 'rxjs';
import { MenuOptionType } from '../../classes/enums';
import { MenuBarOption } from '../../classes/menu-bar-option';
import { NichesSideMenuComponent } from '../niches-side-menu/niches-side-menu.component';
import { ContextMenuComponent } from '../context-menu/context-menu.component';

@Component({
  selector: 'menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent {
  // Private
  private menuOpen!: boolean;
  private nichesSideMenuOpen!: boolean;
  private eventListenersAdded!: boolean;
  private overMenuListener!: Subscription;
  private menuOpenListener!: Subscription;
  private contextMenu!: ContextMenuComponent;
  private overNichesSideMenuListener!: Subscription;

  // Public
  public overMenu!: boolean;
  public overNichesSideMenu!: boolean;
  public nichesSideMenu!: NichesSideMenuComponent;
  public selectedMenuBarOption!: MenuBarOption;
  public menuBarOptions: Array<MenuBarOption> = [

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
          shortcut: 'Alt+V'
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

  constructor(
    public lazyLoadingService: LazyLoadingService,
    private router: Router
  ) { }


  addEventListeners() {
    if (!this.eventListenersAdded) {
      this.eventListenersAdded = true;
      window.addEventListener('mousedown', this.onMouseDown);
      window.addEventListener('keydown', this.onKeyDown);
      window.addEventListener('blur', this.onInnerWindowBlur);
    }
  }


  removeEventListeners() {
    this.eventListenersAdded = false;
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('blur', this.onInnerWindowBlur);
  }



  async openMenu(htmlMenuBarOption: HTMLElement, menuBarOption: MenuBarOption) {
    // As long as a context menu is not currently open
    if (!(this.lazyLoadingService.container.length > 0 && !this.menuOpen)) {

      // If this menu bar option is NOT already selected
      if (menuBarOption != this.selectedMenuBarOption) {
        // Mark this menu bar option as the selected menu bar option
        this.selectedMenuBarOption = menuBarOption;

        // If a menu is already open, then close it
        if (this.menuOpen) this.contextMenu.onHide();
        this.menuOpen = true;

        this.addEventListeners();

        this.lazyLoadingService.load(async () => {
          const { ContextMenuComponent } = await import('../../components/context-menu/context-menu.component');
          const { ContextMenuModule } = await import('../../components/context-menu/context-menu.module');

          return {
            component: ContextMenuComponent,
            module: ContextMenuModule
          }
        }, SpinnerAction.None).then((contextMenu: ContextMenuComponent) => {
          this.contextMenu = contextMenu;
          contextMenu.parentObj = this;
          contextMenu.hasCover = true;
          contextMenu.xPos = htmlMenuBarOption.getBoundingClientRect().left;
          contextMenu.yPos = htmlMenuBarOption.getBoundingClientRect().top + htmlMenuBarOption.getBoundingClientRect().height;
          contextMenu.options = menuBarOption.menuOptions;
          this.overMenuListener = contextMenu.overMenu.subscribe((overMenu: boolean) => {
            this.overMenu = overMenu;
          })
          this.menuOpenListener = contextMenu.menuOpen.subscribe((menuOpen: boolean) => {
            if (!menuOpen) this.closeMenu();
          })
        });

        // When the same menu bar option is clicked again
      } else {
        this.closeMenu();
      }
    }
  }


  closeMenu() {
    this.menuOpen = false;
    this.contextMenu.onHide();
    this.selectedMenuBarOption = null!;
    this.overMenuListener.unsubscribe();
    this.menuOpenListener.unsubscribe();
    this.removeEventListeners();
  }


  openProductBuilder() {
    this.selectedMenuBarOption = null!;
    this.router.navigate(['product-builder']);
  }


  openPageBuilder() {
    this.selectedMenuBarOption = null!;
    this.router.navigate(['page-builder']);

  }


  openEmailBuilder() {
    this.selectedMenuBarOption = null!;
    this.router.navigate(['email-builder']);
  }


  async openNichesSideMenu() {
    if (!this.nichesSideMenuOpen) {
      this.nichesSideMenuOpen = true;
      this.addEventListeners();

      this.lazyLoadingService.load(async () => {
        const { NichesSideMenuComponent } = await import('../niches-side-menu/niches-side-menu.component');
        const { NichesSideMenuModule } = await import('../niches-side-menu/niches-side-menu.module');
        return {
          component: NichesSideMenuComponent,
          module: NichesSideMenuModule
        }
      }, SpinnerAction.None).then((nichesSideMenu: NichesSideMenuComponent) => {
        this.nichesSideMenu = nichesSideMenu;
        this.overNichesSideMenuListener = nichesSideMenu.overNichesSideMenu.subscribe((overNichesSideMenu: boolean) => {
          this.overNichesSideMenu = overNichesSideMenu;
        })
      })

    } else {
      this.closeNichesSideMenu();
    }
  }


  closeNichesSideMenu() {
    this.nichesSideMenu.close();
    this.nichesSideMenuOpen = false;
    this.overNichesSideMenuListener.unsubscribe();
    this.removeEventListeners();
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


  onMouseDown = () => {
    if (!this.overMenu && this.menuOpen) this.closeMenu();

    if (this.nichesSideMenuOpen) {
      // If the niche hierarchy is being displayed
      if (this.nichesSideMenu.sideMenuNiches.listComponent) {
        if (!this.overNichesSideMenu &&
          !this.nichesSideMenu.sideMenuNiches.moveFormOpen &&
          !this.nichesSideMenu.sideMenuNiches.listComponent.listManager.editedItem &&
          !this.nichesSideMenu.sideMenuNiches.listComponent.listManager.contextMenuOpen &&
          !this.nichesSideMenu.sideMenuNiches.listComponent.listManager.promptOpen) {
          this.closeNichesSideMenu();
        }

        // If the search text is being displayed
      } else {
        if (!this.overNichesSideMenu &&
          !this.nichesSideMenu.sideMenuNiches.moveFormOpen &&
          !this.nichesSideMenu.sideMenuNiches.searchComponent.listManager.editedItem &&
          !this.nichesSideMenu.sideMenuNiches.searchComponent.listManager.contextMenuOpen &&
          !this.nichesSideMenu.sideMenuNiches.searchComponent.listManager.promptOpen) {
          this.closeNichesSideMenu();
        }
      }
    }
  }


  onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (this.menuOpen) this.closeMenu();

      if (this.nichesSideMenuOpen) {
        // If the niche hierarchy is being displayed
        if (this.nichesSideMenu.sideMenuNiches.listComponent) {

          if (!this.nichesSideMenu.sideMenuNiches.moveFormOpen &&
            !this.nichesSideMenu.sideMenuNiches.listComponent.listManager.editedItem &&
            !this.nichesSideMenu.sideMenuNiches.listComponent.listManager.contextMenuOpen &&
            !this.nichesSideMenu.sideMenuNiches.listComponent.listManager.promptOpen) {
            this.closeNichesSideMenu();
          }

          // If the search text is being displayed
        } else {
          if (!this.nichesSideMenu.sideMenuNiches.moveFormOpen &&
            !this.nichesSideMenu.sideMenuNiches.searchComponent.listManager.editedItem &&
            !this.nichesSideMenu.sideMenuNiches.searchComponent.listManager.contextMenuOpen &&
            !this.nichesSideMenu.sideMenuNiches.searchComponent.listManager.promptOpen) {
            this.closeNichesSideMenu();
          }
        }
      }
    }
  }


  onInnerWindowBlur = () => {
    if (this.menuOpen) this.closeMenu();

    if (this.nichesSideMenuOpen) {
      // If the niche hierarchy is being displayed
      if (this.nichesSideMenu.sideMenuNiches.listComponent) {
        if (!this.nichesSideMenu.sideMenuNiches.moveFormOpen &&
          !this.nichesSideMenu.sideMenuNiches.listComponent.listManager.promptOpen) {
          this.closeNichesSideMenu();
          this.nichesSideMenu.sideMenuNiches.listComponent.listManager.editedItem = null!;
        }

        // If the search text is being displayed
      } else {
        if (!this.nichesSideMenu.sideMenuNiches.moveFormOpen &&
          !this.nichesSideMenu.sideMenuNiches.searchComponent.listManager.promptOpen) {
          this.closeNichesSideMenu();
          this.nichesSideMenu.sideMenuNiches.searchComponent.listManager.editedItem = null!;
        }
      }
    }
  }
}