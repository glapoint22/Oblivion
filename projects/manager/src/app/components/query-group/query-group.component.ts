import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QueryGroup, QueryRow } from 'widgets';

@Component({
  selector: 'query-group',
  templateUrl: './query-group.component.html',
  styleUrls: ['./query-group.component.scss']
})
export class QueryGroupComponent {
  @Input() queryGroup!: QueryGroup;
  @Output() onRowSelectionChange: EventEmitter<QueryRow> = new EventEmitter();
  @Output() onGroupSelectionChange: EventEmitter<QueryGroup> = new EventEmitter();

  onGroupClick() {
    this.queryGroup.selected = !this.queryGroup.selected;
    this.onGroupSelectionChange.emit(this.queryGroup);
  }
}