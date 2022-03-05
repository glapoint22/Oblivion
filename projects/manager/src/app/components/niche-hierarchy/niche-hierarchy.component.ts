import { Component, ViewChild } from '@angular/core';
import { Hierarchy } from '../../classes/hierarchy';
import { ListUpdate } from '../../classes/list-update';
import { EditableHierarchyComponent } from '../hierarchies/editable-hierarchy/editable-hierarchy.component';

@Component({
  selector: 'niche-hierarchy',
  templateUrl: './niche-hierarchy.component.html',
  styleUrls: ['./niche-hierarchy.component.scss']
})
export class NicheHierarchyComponent {
  @ViewChild('hierarchy') hierarchy!: EditableHierarchyComponent;

  public niches: Array<Hierarchy> =
    [
      {
        id: 1,
        name: 'Item 1a',
        levelID: 0,
        hidden: false,
        arrowDown: false
      },

      {
        id: 2,
        name: 'Item 2a',
        levelID: 1,
        hidden: true,
        arrowDown: false
      },

      {
        id: 3,
        name: 'Item 3a',
        levelID: 2,
        hidden: true,
        arrowDown: false
      },

      {
        id: 4,
        name: 'Item 3b',
        levelID: 2,
        hidden: true,
        arrowDown: false
      },

      {
        id: 5,
        name: 'Item 3c',
        levelID: 2,
        hidden: true,
        arrowDown: false
      },

      {
        id: 6,
        name: 'Item 2b',
        levelID: 1,
        hidden: true,
        arrowDown: false
      },

      {
        id: 7,
        name: 'Item 3d',
        levelID: 2,
        hidden: true,
        arrowDown: false
      },

      {
        id: 8,
        name: 'Item 4a',
        levelID: 3,
        hidden: true,
        arrowDown: false
      },

      {
        id: 9,
        name: 'Item 4b',
        levelID: 3,
        hidden: true,
        arrowDown: false
      },

      {
        id: 10,
        name: 'Item 4c',
        levelID: 3,
        hidden: true,
        arrowDown: false
      },

      {
        id: 11,
        name: 'Item 2c',
        levelID: 1,
        hidden: true,
        arrowDown: false
      },

      {
        id: 12,
        name: 'Item 2d',
        levelID: 1,
        hidden: true,
        arrowDown: false
      },

      {
        id: 13,
        name: 'Item 1b',
        levelID: 0,
        hidden: false,
        arrowDown: false
      },

      {
        id: 14,
        name: 'Item 1c',
        levelID: 0,
        hidden: false,
        arrowDown: false
      },

      {
        id: 15,
        name: 'Item 2e',
        levelID: 1,
        hidden: true,
        arrowDown: false
      }
    ]




  onListUpdate(listUpdate: ListUpdate) {


  }
}
