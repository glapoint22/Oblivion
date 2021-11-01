import { KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { Modal } from '../../classes/modal';

@Component({
  selector: 'add-to-list-form',
  templateUrl: './add-to-list-form.component.html',
  styleUrls: ['./add-to-list-form.component.scss']
})
export class AddToListFormComponent extends Modal {
  public list: Array<KeyValue<any, any>> = [
    {key: 'Trumpy', value: 'Bear'},
    {key: 'Alita', value: 'Battle'}
  ];

  onSubmit() {

  }

  createList() {
    
  }
}
