import { Component, Input, OnChanges } from '@angular/core';
import { Query } from '../../classes/query';
import { QueryGroup } from '../../classes/query-group';
import { QueryBuilderService } from '../../services/query-builder/query-builder.service';

@Component({
  selector: 'query-group',
  templateUrl: './query-group.component.html',
  styleUrls: ['./query-group.component.scss']
})
export class QueryGroupComponent implements OnChanges {
  @Input() queryGroup!: QueryGroup;
  @Input() parent!: Query;

  constructor(public queryBuilderService: QueryBuilderService) { }


  // ---------------------------------------------------------------- Ng On Changes ----------------------------------------------------------------
  public ngOnChanges(): void {
    this.queryGroup.parent = this.parent;
    this.queryGroup.query.parent = this.queryGroup;
  }
}