import { KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { LazyLoad } from '../../classes/lazy-load';

@Component({
  selector: 'add-to-list-form',
  templateUrl: './add-to-list-form.component.html',
  styleUrls: ['./add-to-list-form.component.scss']
})
export class AddToListFormComponent extends LazyLoad {
  public list: Array<KeyValue<any, any>> = [
    {key: 'Trumpy', value: 'Bear'},
    {key: 'Alita', value: 'Battle'}
  ];

  onSubmit() {

  }

  createList() {
    
  }
}
