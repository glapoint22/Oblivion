import { Component, Input } from '@angular/core';
import { QueryGroup } from '../../classes/query-group';
import { SelectableQueryRow } from '../../classes/selectable-query-row';
import { QueryBuilderService } from '../../services/query-builder/query-builder.service';
import { QueryComponent } from '../query/query.component';

@Component({
  selector: 'query-group',
  templateUrl: './query-group.component.html',
  styleUrls: ['./query-group.component.scss']
})
export class QueryGroupComponent implements SelectableQueryRow {
  @Input() queryGroup!: QueryGroup;
  @Input() parentQuery!: QueryComponent;
  public get selected() : boolean {
    return this.queryGroup.selected!;
  }
  public set selected(v : boolean) {
    this.queryGroup.selected = v;
  }

  constructor(public queryBuilderService: QueryBuilderService) { }
}