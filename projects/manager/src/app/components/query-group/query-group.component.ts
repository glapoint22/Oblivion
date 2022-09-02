import { Component, Input, OnInit } from '@angular/core';
import { QueryGroup } from 'widgets';

@Component({
  selector: 'query-group',
  templateUrl: './query-group.component.html',
  styleUrls: ['./query-group.component.scss']
})
export class QueryGroupComponent implements OnInit {
  @Input() queryGroup!: QueryGroup;

  constructor() { }

  ngOnInit(): void {
  }

}
