import { Component } from '@angular/core';
import { ListUpdate } from '../../../classes/list';
import { ListItem } from '../../../classes/list-item';

@Component({
  selector: 'product-groups-property',
  templateUrl: './product-groups-property.component.html',
  styleUrls: ['./product-groups-property.component.scss']
})
export class ProductGroupsPropertyComponent {
  public listChange!: ListUpdate;
  public groups: Array<ListItem> = [
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



  preventUnselect(isSet: boolean){
    this.listChange = new ListUpdate();
    this.listChange.preventUnselect = isSet;
  }


  onAdd() {
    this.groups.push({id: 11, name: 'trumpy'});
    this.listChange = new ListUpdate();
    this.listChange.add = [{
      id:this.groups.length - 1,
      name: 'trumpy'
    }]
  }

  onDelete() {
    this.listChange = new ListUpdate()
    this.listChange.delete = [{
      id: 0,
      name: ''
    }]
  }


  onEdit() {
    this.listChange = new ListUpdate()
    this.listChange.edit = [{
      id: 0,
      name: ''
    }]
  }

  trumpy(hello: any) {
    console.log('result: ', hello)
  }
}