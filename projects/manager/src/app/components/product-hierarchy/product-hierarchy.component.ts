import { Component, OnInit } from '@angular/core';
import { Hierarchy } from '../../classes/hierarchy';

@Component({
  selector: 'product-hierarchy',
  templateUrl: './product-hierarchy.component.html',
  styleUrls: ['./product-hierarchy.component.scss']
})
export class ProductHierarchyComponent implements OnInit {
  public hierarchy: Hierarchy = {
    id: null!,
    name: null!,
    indentId: 0,
    children: [
      {
        id: 1,
        name: 'Item 1a',
        indentId: 0,
        children: [
          {
            id: 2,
            name: 'Item 2a',
            indentId: 1,
            hidden: true,
            children: [
              {
                id: 3,
                name: 'Item 3a',
                indentId: 2,
                hidden: true,
                children: null!
              },
              {
                id: 4,
                name: 'Item 3b',
                indentId: 2,
                hidden: true,
                children: null!
              },
              {
                id: 5,
                name: 'Item 3c',
                indentId: 2,
                hidden: true,
                children: null!
              }
            ]
          },
          {
            id: 6,
            name: 'Item 2b',
            indentId: 1,
            hidden: true,
            children: [
              {
                id: 7,
                name: 'Item 3d',
                indentId: 2,
                hidden: true,
                children: [
                  {
                    id: 8,
                    name: 'Item 4a',
                    indentId: 3,
                    hidden: true,
                    children: null!
                  },
                  {
                    id: 9,
                    name: 'Item 4b',
                    indentId: 3,
                    hidden: true,
                    children: null!
                  },
                  {
                    id: 10,
                    name: 'Item 4c',
                    indentId: 3,
                    hidden: true,
                    children: null!
                  }
                ]
              }
            ]
          },
          {
            id: 11,
            name: 'Item 2c',
            indentId: 1,
            hidden: true,
            children: null!
          },
          {
            id: 12,
            name: 'Item 2d',
            indentId: 1,
            hidden: true,
            children: null!
          }
        ]
      },
      {
        id: 13,
        name: 'Item 1b',
        indentId: 0,
        children: null!
      },
      {
        id: 14,
        name: 'Item 1c',
        indentId: 0,
        children: null!
      }
    ]
  }



  


  constructor() { }

  ngOnInit(): void {
    
  }

}
