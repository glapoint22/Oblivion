import { Component } from '@angular/core';
import { LazyLoad } from 'common';
import { Subject } from 'rxjs';
import { MenuOptionType } from '../../classes/enums';
import { MenuOption } from '../../classes/menu-option';

@Component({
  selector: 'context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent extends LazyLoad {
  public xPos!: number;
  public yPos!: number;
  public parentObj!: object;
  public options!: Array<MenuOption>;
  public MenuOptionType = MenuOptionType;
  public overMenu: Subject<boolean> = new Subject<boolean>();
  public menuVisible!: boolean;

  
  ngAfterViewInit(): void {
    window.setTimeout(() => {

      // If the menu is going beyond the right side of the screen or the menu is going beyond the bottom of the screen
      if (window.innerWidth - (this.xPos + 5) < this.base.nativeElement.clientWidth || window.innerHeight - (this.yPos + 5) < this.base.nativeElement.clientHeight) {

        // If the menu is going beyond the right side of the screen, then put the menu to the left of the cursor
        if(window.innerWidth - (this.xPos + 5) < this.base.nativeElement.clientWidth) this.xPos = this.xPos - this.base.nativeElement.clientWidth - 6;

        // If the menu is going beyond the bottom of the screen
        if (window.innerHeight - (this.yPos + 5) < this.base.nativeElement.clientHeight) {
          
          // If the height of the menu is larger than the screen height
          if(window.innerHeight < this.base.nativeElement.clientHeight)  {
            // Place the menu at the top of the screen
            this.yPos = 0;
            // Make the height of the menu the same height of the screen
            this.base.nativeElement.style.height = (window.innerHeight - 6) + 'px';

            // If the height of the menu is NOT larger than the screen height
          }else {

            // If the bottom of the menu was to be moved above the cursor and it makes the top of the menu go beyond the top of the screen
            if(this.yPos - this.base.nativeElement.clientHeight - 5 < 0) {
              // Keep the menu under the cursor, but shorten the height of the menu so it doesn't go beyond the bottom of the screen
              this.base.nativeElement.style.height = (window.innerHeight - this.yPos - 5) + 'px';
              
              // But if the bottom of the menu was to be moved above the cursor and it doesn't make the top of the menu go beyond the top of the screen
            }else {

              // Move the menu above the cursor
              this.yPos = this.yPos - this.base.nativeElement.clientHeight - 5;
            }
          }
        }
      }
      this.menuVisible = true;
    })
  }


  onClick(optionFunction: Function, functionParameters?: Array<any>) {
    this.container.clear();
    this.overMenu.next(false);
    optionFunction.apply(this.parentObj, functionParameters);
  }
}