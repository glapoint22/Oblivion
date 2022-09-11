import { Component, Input } from '@angular/core';
import { QueryElement } from '../../classes/query-element';
import { QueryBuilderService } from '../../services/query-builder/query-builder.service';

@Component({
  selector: 'query-group',
  templateUrl: './query-group.component.html',
  styleUrls: ['./query-group.component.scss']
})
export class QueryGroupComponent {
  @Input() queryElement!: QueryElement;

  constructor(public queryBuilderService: QueryBuilderService) { }
}