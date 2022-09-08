import { Component, OnInit } from '@angular/core';
import { Query } from '../../classes/query';
import { SelectableQueryRow } from '../../classes/selectable-query-row';
import { QueryBuilderService } from '../../services/query-builder/query-builder.service';
import { QueryGroupComponent } from '../query-group/query-group.component';

@Component({
  selector: 'query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss']
})
export class QueryBuilderComponent implements OnInit {
  public query: Query = new Query();

  constructor(public queryBuilderService: QueryBuilderService) { }


  // ---------------------------------------------------------------- Ng On Init -------------------------------------------------------------------
  public ngOnInit(): void {
    this.queryBuilderService.getQueryLists();
  }




  // ----------------------------------------------------------- Is Group Icon Disabled ------------------------------------------------------------
  isGroupIconDisabled(): boolean {
    if (this.queryBuilderService.selectedQueryRows.length <= 1) return true;

    return !this.queryBuilderService.selectedQueryRows.every(x => x.parentQuery == this.queryBuilderService.selectedQueryRows[0].parentQuery);
  }







  // ---------------------------------------------------------- Is Ungroup Icon Disabled -----------------------------------------------------------
  isUngroupIconDisabled(): boolean {
    if (this.queryBuilderService.selectedQueryRows.length == 0) return true;

    return !this.queryBuilderService.selectedQueryRows.every(x => x instanceof QueryGroupComponent);
  }







  // ------------------------------------------------------------------- Add Row -------------------------------------------------------------------
  public onAddRowClick(): void {
    const parentQuery = this.queryBuilderService.selectedQueryRows[0].parentQuery;

    parentQuery.query.addRow();
    window.setTimeout(() => {
      const queryRow = parentQuery.queryRows.find(x => x.selected);

      this.queryBuilderService.selectedQueryRows = [queryRow!];
    });
  }







  // -------------------------------------------------------------- On Group Click --------------------------------------------------------------
  public onGroupClick(): void {
    const parentQuery = this.queryBuilderService.selectedQueryRows[0].parentQuery;

    parentQuery.query.createGroup();
    window.setTimeout(() => {
      const queryRow = parentQuery.queryRows.find(x => x.selected);

      this.queryBuilderService.selectedQueryRows = [queryRow!];
    });
  }





  // ------------------------------------------------------------- On Ungroup Click -------------------------------------------------------------
  public onUngroupClick(): void {
    const groups = this.queryBuilderService.selectedQueryRows.filter((value, index, self) => {
      return self.findIndex(x => x.parentQuery == value.parentQuery) == index;
    });

    groups.forEach((group: SelectableQueryRow) => {
      group.parentQuery.query.ungroup();
    });

    this.queryBuilderService.selectedQueryRows = [];
  }






  // ------------------------------------------------------------- On Delete Click --------------------------------------------------------------
  onDeleteClick() {
    const rows = this.queryBuilderService.selectedQueryRows.filter((value, index, self) => {
      return self.findIndex(x => x.parentQuery == value.parentQuery) == index;
    });

    rows.forEach((row: SelectableQueryRow) => {
      row.parentQuery.query.deleteRows();
    });

    this.queryBuilderService.selectedQueryRows = [];


    if (this.query.queryRows.length == 0) {
      this.query = new Query();
    }
  }
}