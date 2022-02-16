import { Component, OnInit } from '@angular/core';
import { Hierarchy, HierarchyType } from '../../classes/hierarchy';

@Component({
  selector: 'product-hierarchy',
  templateUrl: './product-hierarchy.component.html',
  styleUrls: ['./product-hierarchy.component.scss']
})
export class ProductHierarchyComponent implements OnInit {
  public hierarchy: Hierarchy = {
    name: null!,
    indentId: 0,
    children: [
      {
        name: 'Item 1a',
        indentId: 0,
        children: [
          {
            name: 'Item 2a',
            indentId: 1,
            hidden: true,
            children: [
              {
                name: 'Item 3a',
                indentId: 2,
                hidden: true,
                children: null!
              },
              {
                name: 'Item 3b',
                indentId: 2,
                hidden: true,
                children: null!
              },
              {
                name: 'Item 3c',
                indentId: 2,
                hidden: true,
                children: null!
              }
            ]
          },
          {
            name: 'Item 2b',
            indentId: 1,
            hidden: true,
            children: [
              {
                name: 'Item 3d',
                indentId: 2,
                hidden: true,
                children: [
                  {
                    name: 'Item 4a',
                    indentId: 3,
                    hidden: true,
                    children: null!
                  },
                  {
                    name: 'Item 4b',
                    indentId: 3,
                    hidden: true,
                    children: null!
                  },
                  {
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
            name: 'Item 2c',
            indentId: 1,
            hidden: true,
            children: null!
          },
          {
            name: 'Item 2d',
            indentId: 1,
            hidden: true,
            children: null!
          }
        ]
      },
      {
        name: 'Item 1b',
        indentId: 0,
        children: null!
      },
      {
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
