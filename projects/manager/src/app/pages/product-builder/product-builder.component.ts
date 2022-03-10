import { Component } from '@angular/core';
import { HierarchyItem } from '../../classes/hierarchy-item';

@Component({
  selector: 'product-builder',
  templateUrl: './product-builder.component.html',
  styleUrls: ['./product-builder.component.scss']
})
export class ProductBuilderComponent {
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
}