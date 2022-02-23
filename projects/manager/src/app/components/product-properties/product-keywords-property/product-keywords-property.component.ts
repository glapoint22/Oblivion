import { Component, OnInit } from '@angular/core';
import { ListItem } from '../../../classes/list-item';

@Component({
  selector: 'product-keywords-property',
  templateUrl: './product-keywords-property.component.html',
  styleUrls: ['./product-keywords-property.component.scss']
})
export class ProductKeywordsPropertyComponent implements OnInit {
  public keywords: Array<ListItem> = [
    {
      id: 1,
      name: 'Keyword 1'
    },
    {
      id: 2,
      name: 'Keyword 2'
    },
    {
      id: 3,
      name: 'Keyword 3'
    },
    {
      id: 4,
      name: 'Keyword 4'
    },
    {
      id: 5,
      name: 'Keyword 5'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
