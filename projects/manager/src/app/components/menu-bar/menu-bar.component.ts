import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { LazyLoadingService, SpinnerAction } from 'common';
import { MenuOptionType } from '../../classes/enums';
import { MenuBarOption } from '../../classes/menu-bar-option';
import { ContextMenuComponent } from '../context-menu/context-menu.component';

@Component({
  selector: 'menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent {
  private contextMenu!: ContextMenuComponent;
  private eventListenersAdded!: boolean;
  public overMenu!: boolean;
  public menuOpen!: boolean;
  public selectedMenuBarOption!: MenuBarOption;
  constructor(public lazyLoadingService: LazyLoadingService, private router: Router) { }
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
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('keydown', this.onKeyDown);
  }


  onMouseDown = () => {
    if (!this.overMenu && this.menuOpen) this.closeMenu();
  }


  onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.closeMenu();
  }


  async openMenu(htmlMenuBarOption: HTMLElement, menuBarOption: MenuBarOption) {
    // As long as a context menu is not currently open and this menu bar option is NOT already selected
    if (!(this.lazyLoadingService.container.length > 0 && !this.menuOpen)) {

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
          contextMenu.overMenu.subscribe((overMenu: boolean) => {
            this.overMenu = overMenu;
          })
        });
      }else {
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