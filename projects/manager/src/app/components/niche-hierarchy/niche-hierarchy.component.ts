import { Component, ViewChild } from '@angular/core';
import { LazyLoad } from 'common';
import { Subject } from 'rxjs';
import { ListUpdateType, MenuOptionType } from '../../classes/enums';
import { HierarchyItem } from '../../classes/hierarchy-item';
import { ListOptions } from '../../classes/list-options';
import { ListUpdate } from '../../classes/list-update';
import { HierarchyComponent } from '../hierarchies/hierarchy/hierarchy.component';

@Component({
  selector: 'niche-hierarchy',
  templateUrl: './niche-hierarchy.component.html',
  styleUrls: ['./niche-hierarchy.component.scss']
})
export class NicheHierarchyComponent  extends LazyLoad{
  @ViewChild('hierarchy') hierarchy!: HierarchyComponent;
  public niches!: Array<HierarchyItem>;
  public showSearch!: boolean;
  public overNicheHierarchy: Subject<boolean> = new Subject<boolean>();
  public isParent!: boolean;
  public options: ListOptions = {
    editable: true,
    menu: {
      parentObj: this,
      menuOptions: [
        {
          type: MenuOptionType.MenuItem,
          name: 'Open to the Side',
          shortcut: 'Ctrl+Enter',
        },
        {
          type: MenuOptionType.MenuItem,
          name: 'Open Width...',
        },
        {
          type: MenuOptionType.MenuItem,
          name: 'Reveal in File Explorer',
          shortcut: 'Shift+Alt+R'
        },
        {
          type: MenuOptionType.MenuItem,
          name: 'Open in Intergrated Terminal',
        },
        {
          type: MenuOptionType.Divider
        },
        {
          type: MenuOptionType.MenuItem,
          name: 'Select for Compare',
        },
        {
          type: MenuOptionType.Divider
        },
        {
          type: MenuOptionType.MenuItem,
          name: 'Open Timeline',
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
          type: MenuOptionType.Divider
        },
        {
          type: MenuOptionType.MenuItem,
          name: 'Copy Path',
          shortcut: 'Shift+Alt+C'
        },
        {
          type: MenuOptionType.MenuItem,
          name: 'Copy Relative Path',
          shortcut: 'Ctrl+K Ctrl+Shift+C'
        },
        {
          type: MenuOptionType.Divider
        },
        {
          type: MenuOptionType.MenuItem,
          name: 'Rename',
          shortcut: 'F2'
        },
        {
          type: MenuOptionType.MenuItem,
          name: 'Delete',
          shortcut: 'Delete'
        }
      ]
    }
  }
  




  private _listUpdate: ListUpdate = new ListUpdate();
  public get listUpdate(): ListUpdate {
    return this._listUpdate;
  }
  public set listUpdate(v: ListUpdate) {
    this._listUpdate = v;

    if (v.type == ListUpdateType.Add) {
      // this.niches[v.index!].id = 22;
    }

    if (v.type == ListUpdateType.Delete) {
      console.log(v.deletedItems)
    }

    if (v.type == ListUpdateType.ArrowClicked) {
      // console.log(v.hasChildren)
    }

    this.options.menu!.menuOptions[0].isDisabled = v.editDisabled;
  }



  hello() {
    this.showSearch = !this.showSearch;

    window.setTimeout(()=> {
      document.getElementById('searchInput')?.focus();
    })
    
    
  }


}