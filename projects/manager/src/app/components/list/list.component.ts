import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ListUpdate } from '../../classes/list';
import { ListItem } from '../../classes/list-item';
import { ListOptions } from '../../classes/list-options';

@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @Input() list!: Array<ListItem>;
  @Input() listChange!: ListUpdate;
  @Output() onListUpdate: EventEmitter<ListUpdate> = new EventEmitter();

  public options: ListOptions = {
    isEditable: true
  }

  constructor() { }
  

  ngOnInit(): void {
    
  }


  
  
}