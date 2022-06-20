import { Component } from '@angular/core';
import { LazyLoadingService, SpinnerAction } from 'common';
import { MenuOptionType } from '../../classes/enums';
import { MenuOption } from '../../classes/menu-option';
import { ContextMenuComponent } from '../../components/context-menu/context-menu.component';

@Component({
  selector: 'product-builder',
  templateUrl: './product-builder.component.html',
  styleUrls: ['./product-builder.component.scss']
})
export class ProductBuilderComponent {
  private menuOptions!: Array<MenuOption>;

  constructor(private lazyLoadingService: LazyLoadingService) { }

  ngOnInit() {
    this.menuOptions = [
      {
        name: 'Alita',
        type: MenuOptionType.MenuItem,
        shortcut: 'Alt+A'
      },
      {
        name: 'Battle',
        type: MenuOptionType.MenuItem,
        shortcut: 'F2',
        optionFunction: this.battle
      },
      {
        type: MenuOptionType.Divider,
      },
      {
        name: 'Angel',
        type: MenuOptionType.Submenu,
        shortcut: 'Delete',
        options: [
          {
            name: 'Sub Menu Option',
            type: MenuOptionType.MenuItem,
            shortcut: 'Ctrl+S'
          },
          {
            name: 'Sub Menu Option 2',
            type: MenuOptionType.MenuItem,
            shortcut: 'Ctrl+S'
          },
          {
            name: 'Sub Menu Option 3',
            type: MenuOptionType.MenuItem,
            shortcut: 'Ctrl+S'
          }
        ]
      },
      {
        name: 'Sub',
        type: MenuOptionType.Submenu,
        options: [
          {
            name: 'Sub Menu Option',
            type: MenuOptionType.MenuItem,
            shortcut: 'Ctrl+S'
          },
          {
            name: 'Musky',
            type: MenuOptionType.MenuItem,
            shortcut: 'Ctrl+S',
            optionFunction: this.musky
          },
          {
            type: MenuOptionType.Divider,
          },
          {
            name: 'Sub Menu Option 3',
            type: MenuOptionType.Submenu,
            shortcut: 'Ctrl+S',
            options: [
              {
                name: 'Sub Menu Option',
                type: MenuOptionType.MenuItem,
                shortcut: 'Ctrl+S'
              },
              {
                name: 'Sub Menu Option 2',
                type: MenuOptionType.MenuItem,
                shortcut: 'Ctrl+S'
              },
              {
                name: 'Sub Menu Option 3',
                type: MenuOptionType.Submenu,
                shortcut: 'Ctrl+S',
                options: [
                  {
                    name: 'Sub Menu Option',
                    type: MenuOptionType.MenuItem,
                    shortcut: 'Ctrl+S'
                  },
                  {
                    name: 'Sub Menu Option 2',
                    type: MenuOptionType.MenuItem,
                    shortcut: 'Ctrl+S'
                  },
                  {
                    name: 'Trumpy',
                    type: MenuOptionType.MenuItem,
                    shortcut: 'Ctrl+S',
                    optionFunction: this.trumpy
                  },
                  {
                    name: 'Sub Menu Option 4',
                    type: MenuOptionType.MenuItem,
                    shortcut: 'Ctrl+S'
                  }
                ]
              },
              {
                name: 'Sub Menu Option 4',
                type: MenuOptionType.MenuItem,
                shortcut: 'Ctrl+S'
              }
            ]
          },
          {
            name: 'Sub Menu Option 4',
            type: MenuOptionType.MenuItem,
            shortcut: 'Ctrl+S'
          }
        ]
      }
    ]
  }

  battle() {
    console.log('battle')
  }

  trumpy() {
    console.log('trumpy')
  }

  musky() {
    console.log('musky')
  }

  async openContextMenu(e: MouseEvent) {
    this.lazyLoadingService.load(async () => {
      const { ContextMenuComponent } = await import('../../components/context-menu/context-menu.component');
      const { ContextMenuModule } = await import('../../components/context-menu/context-menu.module');

      return {
        component: ContextMenuComponent,
        module: ContextMenuModule
      }
    }, SpinnerAction.None).then((contextMenu: ContextMenuComponent) => {
      contextMenu.xPos = e.clientX + 5;
      contextMenu.yPos = e.clientY + 5;
      contextMenu.parentObj = this;
      contextMenu.options = this.menuOptions;
    });
  }
}