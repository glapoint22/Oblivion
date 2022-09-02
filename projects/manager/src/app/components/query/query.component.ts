import { Component, Input, OnInit } from '@angular/core';
import { Query } from 'widgets';

@Component({
  selector: 'query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent implements OnInit {
  @Input() query!: Query;

  constructor() { }

  ngOnInit(): void {
  }

}
