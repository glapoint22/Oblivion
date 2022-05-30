import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadingService, SpinnerAction } from 'common';
import { Subscription } from 'rxjs';
import { MenuOptionType } from '../../classes/enums';
import { MenuBarOption } from '../../classes/menu-bar-option';
import { NicheHierarchyComponent } from '../../components/niche-hierarchy/niche-hierarchy.component';
import { ContextMenuComponent } from '../context-menu/context-menu.component';

@Component({
  selector: 'menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent {
  // Private
  private menuOpen!: boolean;
  private nicheHierarchyOpen!: boolean;
  private eventListenersAdded!: boolean;
  private overMenuListener!: Subscription;
  private menuOpenListener!: Subscription;
  private contextMenu!: ContextMenuComponent;
  private overNicheHierarchyListener!: Subscription;

  // Public
  public overMenu!: boolean;
  public overNicheHierarchy!: boolean;
  public nicheHierarchy!: NicheHierarchyComponent;
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


  async openNicheHierarchy() {
    if (!this.nicheHierarchyOpen) {
      this.nicheHierarchyOpen = true;
      this.addEventListeners();

      this.lazyLoadingService.load(async () => {
        const { NicheHierarchyComponent } = await import('../../components/niche-hierarchy/niche-hierarchy.component');
        const { NicheHierarchyModule } = await import('../../components/niche-hierarchy/niche-hierarchy.module');
        return {
          component: NicheHierarchyComponent,
          module: NicheHierarchyModule
        }
      }, SpinnerAction.None).then((nicheHierarchy: NicheHierarchyComponent) => {
        this.nicheHierarchy = nicheHierarchy;
        this.overNicheHierarchyListener = nicheHierarchy.overNicheHierarchy.subscribe((overNicheHierarchy: boolean) => {
          this.overNicheHierarchy = overNicheHierarchy;
        })
      })

    } else {
      this.closeNicheHierarchy();
    }
  }


  closeNicheHierarchy() {
    this.nicheHierarchy.close();
    this.nicheHierarchyOpen = false;
    this.overNicheHierarchyListener.unsubscribe();
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

    if (this.nicheHierarchyOpen) {
      // If the niche hierarchy is being displayed
      if (this.nicheHierarchy.hierarchyComponent) {
        if (!this.overNicheHierarchy &&
          !this.nicheHierarchy.nicheHierarchyManager.moveFormOpen &&
          !this.nicheHierarchy.hierarchyComponent.listManager.editedItem &&
          !this.nicheHierarchy.hierarchyComponent.listManager.contextMenuOpen &&
          !this.nicheHierarchy.hierarchyComponent.listManager.promptOpen) {
          this.closeNicheHierarchy();
        }

        // If the search text is being displayed
      } else {
        if (!this.overNicheHierarchy &&
          !this.nicheHierarchy.nicheHierarchyManager.moveFormOpen &&
          !this.nicheHierarchy.searchComponent.listManager.editedItem &&
          !this.nicheHierarchy.searchComponent.listManager.contextMenuOpen &&
          !this.nicheHierarchy.searchComponent.listManager.promptOpen) {
          this.closeNicheHierarchy();
        }
      }
    }
  }


  onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (this.menuOpen) this.closeMenu();

      if (this.nicheHierarchyOpen) {
        // If the niche hierarchy is being displayed
        if (this.nicheHierarchy.hierarchyComponent) {

          if (!this.nicheHierarchy.nicheHierarchyManager.moveFormOpen &&
            !this.nicheHierarchy.hierarchyComponent.listManager.editedItem &&
            !this.nicheHierarchy.hierarchyComponent.listManager.contextMenuOpen &&
            !this.nicheHierarchy.hierarchyComponent.listManager.promptOpen) {
            this.closeNicheHierarchy();
          }

          // If the search text is being displayed
        } else {
          if (!this.nicheHierarchy.nicheHierarchyManager.moveFormOpen &&
            !this.nicheHierarchy.searchComponent.listManager.editedItem &&
            !this.nicheHierarchy.searchComponent.listManager.contextMenuOpen &&
            !this.nicheHierarchy.searchComponent.listManager.promptOpen) {
            this.closeNicheHierarchy();
          }
        }
      }
    }
  }


  onInnerWindowBlur = () => {
    if (this.menuOpen) this.closeMenu();

    if (this.nicheHierarchyOpen) {
      // If the niche hierarchy is being displayed
      if (this.nicheHierarchy.hierarchyComponent) {
        if (!this.nicheHierarchy.nicheHierarchyManager.moveFormOpen &&
          !this.nicheHierarchy.hierarchyComponent.listManager.promptOpen) {
          this.closeNicheHierarchy();
          this.nicheHierarchy.hierarchyComponent.listManager.editedItem = null!;
        }

        // If the search text is being displayed
      } else {
        if (!this.nicheHierarchy.nicheHierarchyManager.moveFormOpen &&
          !this.nicheHierarchy.searchComponent.listManager.promptOpen) {
          this.closeNicheHierarchy();
          this.nicheHierarchy.searchComponent.listManager.editedItem = null!;
        }
      }
    }
  }
}