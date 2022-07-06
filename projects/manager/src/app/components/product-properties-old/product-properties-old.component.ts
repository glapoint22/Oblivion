import { Component } from '@angular/core';
import { ListItem } from '../../classes/list-item';

@Component({
  selector: 'product-properties-old',
  templateUrl: './product-properties-old.component.html',
  styleUrls: ['./product-properties-old.component.scss']
})
export class ProductPropertiesOldComponent {
  public productGroups: Array<ListItem> = [
    {
      id: 1,
      name: 'Group 1'
    },
    {
      id: 2,
      name: 'Group 2'
    },
    {
      id: 3,
      name: 'Group 3'
    },
    {
      id: 4,
      name: 'Group 4'
    },
    {
      id: 5,
      name: 'Group 5'
    },
    {
      id: 6,
      name: 'Group 6'
    },
    {
      id: 7,
      name: 'Group 7'
    },
    {
      id: 8,
      name: 'Group 8'
    },
    {
      id: 9,
      name: 'Group 9'
    },
    {
      id: 10,
      name: 'Group 10'
    }
  ]
}
