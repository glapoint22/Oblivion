import { Component, OnInit } from '@angular/core';
import { Hierarchy } from '../../classes/hierarchy';

@Component({
  selector: 'product-hierarchy',
  templateUrl: './product-hierarchy.component.html',
  styleUrls: ['./product-hierarchy.component.scss']
})
export class ProductHierarchyComponent implements OnInit {
  // public hierarchy: Hierarchy = {
  //   id: null!,
  //   name: null!,
  //   levelID: 0,
  //   children: [
  //     {
  //       id: 1,
  //       name: 'Item 1a',
  //       levelID: 0,
  //       children: [
  //         {
  //           id: 2,
  //           name: 'Item 2a',
  //           levelID: 1,
  //           hidden: true,
  //           children: [
  //             {
  //               id: 3,
  //               name: 'Item 3a',
  //               levelID: 2,
  //               hidden: true,
  //               children: null!
  //             },
  //             {
  //               id: 4,
  //               name: 'Item 3b',
  //               levelID: 2,
  //               hidden: true,
  //               children: null!
  //             },
  //             {
  //               id: 5,
  //               name: 'Item 3c',
  //               levelID: 2,
  //               hidden: true,
  //               children: null!
  //             }
  //           ]
  //         },
  //         {
  //           id: 6,
  //           name: 'Item 2b',
  //           levelID: 1,
  //           hidden: true,
  //           children: [
  //             {
  //               id: 7,
  //               name: 'Item 3d',
  //               levelID: 2,
  //               hidden: true,
  //               children: [
  //                 {
  //                   id: 8,
  //                   name: 'Item 4a',
  //                   levelID: 3,
  //                   hidden: true,
  //                   children: null!
  //                 },
  //                 {
  //                   id: 9,
  //                   name: 'Item 4b',
  //                   levelID: 3,
  //                   hidden: true,
  //                   children: null!
  //                 },
  //                 {
  //                   id: 10,
  //                   name: 'Item 4c',
  //                   levelID: 3,
  //                   hidden: true,
  //                   children: null!
  //                 }
  //               ]
  //             }
  //           ]
  //         },
  //         {
  //           id: 11,
  //           name: 'Item 2c',
  //           levelID: 1,
  //           hidden: true,
  //           children: null!
  //         },
  //         {
  //           id: 12,
  //           name: 'Item 2d',
  //           levelID: 1,
  //           hidden: true,
  //           children: null!
  //         }
  //       ]
  //     },
  //     {
  //       id: 13,
  //       name: 'Item 1b',
  //       levelID: 0,
  //       children: null!
  //     },
  //     {
  //       id: 14,
  //       name: 'Item 1c',
  //       levelID: 0,
  //       children: null!
  //     }
  //   ]
  // }



  


  constructor() { }

  ngOnInit(): void {
    
  }

}
