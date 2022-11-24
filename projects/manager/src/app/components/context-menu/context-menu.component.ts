import { Component, HostListener } from '@angular/core';
import { LazyLoad, SpinnerAction } from 'common';
import { Subject } from 'rxjs';
import { MenuOptionType } from '../../classes/enums';
import { MenuOption } from '../../classes/menu-option';

@Component({
  selector: 'context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent extends LazyLoad {
  private menuOptionOverListener!: number;
  private submenuOptionOverListener!: number;
  public submenuOptionOutListener!: number;
  private submenu!: ContextMenuComponent;
  public rootMenu!: ContextMenuComponent;
  public parentMenu!: ContextMenuComponent;

  public xPos!: number;
  public yPos!: number;
  public parentObj!: object;
  public options!: Array<MenuOption>;
  public MenuOptionType = MenuOptionType;
  public menuOpen: Subject<boolean> = new Subject<boolean>();
  public menuVisible!: boolean;
  public hasCover!: boolean;
  public activatedSubmenuOption!: MenuOption;

  ngOnInit() {
    super.ngOnInit();
    window.setTimeout(()=> {
      window.addEventListener('mousedown', this.mousedown);
    })
  }

  mousedown = ()=> {
    this.onHide();
    this.menuOpen.next(false);
  }


  ngOnDestroy() {
    super.ngOnDestroy();
    window.removeEventListener('mousedown', this.mousedown);
  }

  // @HostListener('window:mousedown')
  // onWindowMouseDown() {
  //   this.onHide();
  //   this.menuOpen.next(false);
  // }


  // @HostListener('window:blur')
  // onWindowBlur() {
  //   this.onHide();
  //   this.menuOpen.next(false);
  // }


  onEscape(): void {

    if (this.container.length - 1 == this.container.indexOf(this.viewRef)) {

      const index = this.container.indexOf(this.viewRef);

      if (index != -1) this.container.remove();
      this.menuOpen.next(false);
    }
  }





  ngAfterViewInit(): void {
    window.setTimeout(() => {

      // If its the root menu
      if (this.rootMenu == null) {
        this.rootMenu = this;

        // If the menu is going beyond the right side of the screen, then put the menu to the left of the cursor
        if (window.innerWidth - (this.xPos + 5) < this.base.nativeElement.clientWidth) this.xPos = this.xPos - this.base.nativeElement.clientWidth - 6;

        // If the menu is going beyond the bottom of the screen
        if (window.innerHeight - (this.yPos + 5) < this.base.nativeElement.clientHeight) {

          // If the height of the menu is larger than the screen height
          if (window.innerHeight < this.base.nativeElement.clientHeight) {
            // Place the menu at the top of the screen
            this.yPos = 0;
            // Make the height of the menu the same height of the screen
            this.base.nativeElement.style.height = (window.innerHeight - 6) + 'px';

            // If the height of the menu is NOT larger than the screen height
          } else {

            // If the bottom of the menu was to be moved above the cursor and it makes the top of the menu go beyond the top of the screen
            if (this.yPos - this.base.nativeElement.clientHeight - 5 < 0) {
              // Keep the menu under the cursor, but shorten the height of the menu so it doesn't go beyond the bottom of the screen
              this.base.nativeElement.style.height = (window.innerHeight - this.yPos - 5) + 'px';

              // But if the bottom of the menu was to be moved above the cursor and it doesn't make the top of the menu go beyond the top of the screen
            } else {

              // Move the menu above the cursor
              this.yPos = this.yPos - this.base.nativeElement.clientHeight - 5;
            }
          }
        }

        // If its a submenu
      } else {

        // If the submenu is going beyond the right side of the screen, then put the submenu to the left of its parent menu
        if (window.innerWidth - this.xPos < this.base.nativeElement.clientWidth) {
          this.xPos = this.parentMenu.base.nativeElement.getBoundingClientRect().left - this.base.nativeElement.clientWidth;
        }

        // If the menu is going beyond the bottom of the screen, then place the bottom of the submenu at the position of its submenu option
        if (window.innerHeight - this.yPos < this.base.nativeElement.clientHeight) {
          this.yPos = this.yPos - this.base.nativeElement.clientHeight + 41;
        }
      }
      this.menuVisible = true;
    })
  }


  onMainMenuOver() {
    if (this.parentMenu) {
      const index = this.parentMenu.options.findIndex(x => x.options == this.options);
      this.parentMenu.activatedSubmenuOption = this.parentMenu.options[index];
    }
  }


  clearParentListeners() {
    // As long as the mouse isn't hovering over the root menu
    if (this.parentMenu) {
      // If the (Menu Option Over Listener) was triggered on the parent of this menu, then we'll clear it here while hovering over its child menu
      clearTimeout(this.parentMenu.menuOptionOverListener);
      this.parentMenu.menuOptionOverListener = null!;

      // If the (Submenu Option Out Listener) was triggered on the parent of this menu, then we'll clear it here while hovering over its child menu
      clearTimeout(this.parentMenu.submenuOptionOutListener);
      this.parentMenu.submenuOptionOutListener = null!;
    }
  }




  onMenuOptionOver() {
    // First, clear any submenu options that may be activated
    this.activatedSubmenuOption = null!;

    // If a submenu is open
    if (this.submenu) {

      // And as long as NO listeners have been triggered yet
      if (this.menuOptionOverListener == null && this.submenuOptionOutListener == null) {

        // Then set the (Menu Option Over Listener)
        this.menuOptionOverListener = window.setTimeout(() => {
          this.submenu.close();
          this.submenu = null!;
          this.activatedSubmenuOption = null!;
          this.menuOptionOverListener = null!;
        }, 500)
      }
    }
    // Clear any listeners that might have been triggered on this menu's parent
    this.clearParentListeners();
  }





  onSubmenuOptionOver(htmlSubmenuOption: HTMLElement, index: number) {
    // First, clear any submenu options that may be activated
    this.activatedSubmenuOption = null!;

    // If a submenu has NOT been opened yet
    if (!this.submenu) {

      // And the submenu that belongs to the submenu option we're hovering over has options defined
      if (this.options[index].options) {

        // Delay the opening of the submenu
        this.submenuOptionOverListener = window.setTimeout(() => {
          this.openSubmenu(htmlSubmenuOption.getBoundingClientRect().left + htmlSubmenuOption.getBoundingClientRect().width + 1, htmlSubmenuOption.getBoundingClientRect().top - 7, this.options[index].options!, this.rootMenu, this)
        }, 500)
      }

      // But if a submenu is already open
    } else {

      // And as long as the submenu that's open does NOT belong to the submenu option we're hovering over
      // (meaning we hovered over a submenu option that didn't open the submenu that's currently open)
      if (htmlSubmenuOption.getBoundingClientRect().top != this.submenu.yPos + 7) {

        // Then as long as the submenu that belongs to the submenu option we're hovering over has options defined
        if (this.options[index].options) {

          // And as long as NO listeners have been triggered yet
          if (this.menuOptionOverListener == null && this.submenuOptionOutListener == null) {

            // Delay the opening of the submenu
            this.submenuOptionOverListener = window.setTimeout(() => {

              // Then close the submenu that's already open
              this.submenu.close();
              this.submenu = null!;

              // And open the new submenu
              this.openSubmenu(htmlSubmenuOption.getBoundingClientRect().left + htmlSubmenuOption.getBoundingClientRect().width + 1, htmlSubmenuOption.getBoundingClientRect().top - 7, this.options[index].options!, this.rootMenu, this)
            }, 500)
          }
        }

        // But if the submenu DOES belong to the submenu option we're hovering over
      } else {

        // Clear the (Menu Option Over Listener) in case it was triggerd. We don't need it to close the submenu anymore
        clearTimeout(this.menuOptionOverListener);
        this.menuOptionOverListener = null!;
      }
    }
    // Clear the (Submenu Option Out Listener) in case it was triggerd. We don't need it to close the submenu anymore
    clearTimeout(this.submenuOptionOutListener);
    this.submenuOptionOutListener = null!;

    // And clear any listeners that might have been triggered on this menu's parent
    this.clearParentListeners();
  }






  onSubmenuOptionOut(e: MouseEvent, htmlSubmenuOption: HTMLElement) {
    // If a submenu is open
    if (this.submenu) {

      // If we're NOT hovering over the submenu (meaning the mouse didn't move to the right of the submenu option)
      if (e.clientX < htmlSubmenuOption.getBoundingClientRect().right) {

        // And if we're NOT hovering over another submenu option or another menu option (meaning the mouse has moved completely outside the main menu)
        if (e.clientX <= this.base.nativeElement.getBoundingClientRect().left ||
          e.clientY >= this.base.nativeElement.getBoundingClientRect().bottom - 7) {

          // And as long as NO listeners have been triggered yet
          if (this.menuOptionOverListener == null && this.submenuOptionOutListener == null) {

            // Delay the closing of the submenu
            this.submenuOptionOutListener = window.setTimeout(() => {
              this.submenu.close();
              this.submenu = null!;
              this.activatedSubmenuOption = null!;
              this.submenuOptionOutListener = null!;

            }, 500)
          }
        }
      }
    }
    // If we moved away from the submenu option before the submenu had a chance to open, kill the timer
    clearTimeout(this.submenuOptionOverListener);
  }






  onClick(optionFunction: Function, functionParameters?: Array<any>) {
    this.rootMenu.close();
    optionFunction.apply(this.parentObj, functionParameters);
  }

  onHide() {
    const index = this.container.indexOf(this.viewRef);
    if (index != -1) this.container.remove(index);
  }

  close() {
    this.onHide();
    this.menuOpen.next(false);
    if (this.submenu != null) {
      this.submenu.close();
      this.submenu = null!;
    }
  }


  async openSubmenu(xPos: number, yPos: number, options: Array<MenuOption>, rootMenu: ContextMenuComponent, parentMenu: ContextMenuComponent) {
    this.lazyLoadingService.load(async () => {
      const { ContextMenuComponent } = await import('../../components/context-menu/context-menu.component');
      const { ContextMenuModule } = await import('../../components/context-menu/context-menu.module');

      return {
        component: ContextMenuComponent,
        module: ContextMenuModule
      }
    }, SpinnerAction.None).then((submenu: ContextMenuComponent) => {
      this.submenu = submenu;
      this.submenu.rootMenu = rootMenu;
      this.submenu.parentMenu = parentMenu;
      submenu.xPos = xPos;
      submenu.yPos = yPos;
      submenu.parentObj = this.parentObj;
      submenu.options = options;
    });
  }
}