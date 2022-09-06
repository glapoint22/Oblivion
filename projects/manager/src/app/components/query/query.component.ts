import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Query, QueryGroup, QueryRow } from 'widgets';

@Component({
  selector: 'query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent {
  @Input() query!: Query;
  // @Input() queryGroup!: QueryGroup;
  @Output() onRowSelectionChange: EventEmitter<QueryRow> = new EventEmitter();
  @Output() onGroupSelectionChange: EventEmitter<QueryGroup> = new EventEmitter();

  // public ngOnChanges(): void {
  //   if (this.queryGroup) {
  //     this.query.queryGroup = this.queryGroup;
  //   }
  // }
}