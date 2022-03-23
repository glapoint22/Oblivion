import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadingService, SpinnerAction } from 'common';
import { Subscription } from 'rxjs';
import { MenuOptionType } from '../../classes/enums';
import { HierarchyItem } from '../../classes/hierarchy-item';
import { MenuBarOption } from '../../classes/menu-bar-option';
import { NicheHierarchyComponent } from '../../components/niche-hierarchy/niche-hierarchy.component';
import { ContextMenuComponent } from '../context-menu/context-menu.component';

@Component({
  selector: 'menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent {
  private contextMenu!: ContextMenuComponent;
  private eventListenersAdded!: boolean;
  public nicheHierarchy!: NicheHierarchyComponent;
  public overMenu!: boolean;
  private overMenuListener!: Subscription;
  private overNicheHierarchyListener!: Subscription;
  private menuOpen!: boolean;
  private nicheHierarchyOpen!: boolean;
  public overNicheHierarchy!: boolean;
  public selectedMenuBarOption!: MenuBarOption;
  constructor(public lazyLoadingService: LazyLoadingService, private router: Router) { }






  public niches: Array<HierarchyItem> =
    [
      {
        id: 1,
        name: 'Item 1a',
        hierarchyGroupID: 0,
        hidden: false,
        arrowDown: false
      },

      {
        id: 2,
        name: 'Item 2a',
        hierarchyGroupID: 1,
        hidden: true,
        arrowDown: false
      },

      {
        id: 3,
        name: 'Item 3a',
        hierarchyGroupID: 2,
        hidden: true,
        arrowDown: false
      },

      {
        id: 4,
        name: 'Item 3b',
        hierarchyGroupID: 2,
        hidden: true,
        arrowDown: false
      },

      {
        id: 5,
        name: 'Item 3c',
        hierarchyGroupID: 2,
        hidden: true,
        arrowDown: false
      },

      {
        id: 6,
        name: 'Item 2b',
        hierarchyGroupID: 1,
        hidden: true,
        arrowDown: false
      },

      {
        id: 7,
        name: 'Item 3d',
        hierarchyGroupID: 2,
        hidden: true,
        arrowDown: false
      },

      {
        id: 8,
        name: 'Item 4a',
        hierarchyGroupID: 3,
        hidden: true,
        arrowDown: false
      },

      {
        id: 9,
        name: 'Item 4b',
        hierarchyGroupID: 3,
        hidden: true,
        arrowDown: false
      },

      {
        id: 10,
        name: 'Item 4c',
        hierarchyGroupID: 3,
        hidden: true,
        arrowDown: false
      },

      {
        id: 11,
        name: 'Item 2c',
        hierarchyGroupID: 1,
        hidden: true,
        arrowDown: false
      },

      {
        id: 12,
        name: 'Item 2d',
        hierarchyGroupID: 1,
        hidden: true,
        arrowDown: false
      },

      {
        id: 13,
        name: 'Item 1b',
        hierarchyGroupID: 0,
        hidden: false,
        arrowDown: false
      },

      {
        id: 14,
        name: 'Item 1c',
        hierarchyGroupID: 0,
        hidden: false,
        arrowDown: false
      },

      {
        id: 15,
        name: 'Item 2e',
        hierarchyGroupID: 1,
        hidden: true,
        arrowDown: false
      }
    ]










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
          shortcut: 'Shift+F'
        },
        {
          type: MenuOptionType.MenuItem,
          name: 'Keywords',
          shortcut: 'Alt+K'
        },
        {
          type: MenuOptionType.MenuItem,
          name: 'Groups',
          shortcut: 'Alt+G'
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


  async onNicheShackLogoClick() {

    if (!this.nicheHierarchyOpen) {
      this.nicheHierarchyOpen = true;
      window.addEventListener('mousedown', this.onMouseDown);

      this.lazyLoadingService.load(async () => {
        const { NicheHierarchyComponent } = await import('../../components/niche-hierarchy/niche-hierarchy.component');
        const { NicheHierarchyModule } = await import('../../components/niche-hierarchy/niche-hierarchy.module');
        return {
          component: NicheHierarchyComponent,
          module: NicheHierarchyModule
        }
      }, SpinnerAction.None).then((nicheHierarchy: NicheHierarchyComponent) => {
        this.nicheHierarchy = nicheHierarchy;
        nicheHierarchy.niches = this.niches;
        this.overNicheHierarchyListener = nicheHierarchy.overNicheHierarchy.subscribe((overNicheHierarchy: boolean)=> {
          this.overNicheHierarchy = overNicheHierarchy;
        })
      })

    } else {
      this.closeNicheHierarchy();
    }




  }


  addEventListeners() {
    if (!this.eventListenersAdded) {
      this.eventListenersAdded = true;
      window.addEventListener('mousedown', this.onMouseDown);
      window.addEventListener('keydown', this.onKeyDown);
    }
  }



  closeMenu() {
    this.menuOpen = false;
    this.contextMenu.onHide();
    this.eventListenersAdded = false;
    this.selectedMenuBarOption = null!;
    this.overMenuListener.unsubscribe();
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('keydown', this.onKeyDown);
  }


  closeNicheHierarchy() {
    this.nicheHierarchy.close();
    this.nicheHierarchyOpen = false;
    this.overNicheHierarchyListener.unsubscribe();
    window.removeEventListener('mousedown', this.onMouseDown);
  }


  onMouseDown = () => {
    if (!this.overMenu && this.menuOpen) this.closeMenu();
    if (this.nicheHierarchyOpen && !this.overNicheHierarchy) this.closeNicheHierarchy();
  }


  onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.closeMenu();
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
        });
      } else {
        this.closeMenu();
      }
    }
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
}