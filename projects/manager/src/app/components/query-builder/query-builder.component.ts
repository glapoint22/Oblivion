import { Component } from '@angular/core';
import { ComparisonOperatorType, LogicalOperatorType, Query, QueryGroup, QueryRow, QueryType } from 'widgets';

@Component({
  selector: 'query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss']
})
export class QueryBuilderComponent {
  public query: Query = new Query();
  public selectedRows: Array<QueryRow> = [];
  public selectedGroups: Array<QueryGroup> = [];




  // ngOnInit() {
  //   this.query = {
  //     addRow: () => { },
  //     deleteRow: () => { },
  //     createGroup: () => { },
  //     queryRows: [
  //       {
  //         queryGroup: {
  //           query: {
  //             addRow: () => { },
  //             deleteRow: () => { },
  //             createGroup: () => { },
  //             queryRows: [
  //               {
  //                 queryType: QueryType.Price,
  //                 comparisonOperatorType: ComparisonOperatorType.GreaterThanOrEqual,
  //                 price: 5.99
  //               },
  //               {
  //                 logicalOperatorType: LogicalOperatorType.And
  //               },
  //               {
  //                 queryType: QueryType.Date,
  //                 comparisonOperatorType: ComparisonOperatorType.GreaterThan,
  //                 date: new Date('09/01/2022')
  //               }
  //             ]
  //           }
  //         }
  //       },
  //       {
  //         logicalOperatorType: LogicalOperatorType.Or
  //       },
  //       {
  //         queryGroup: {
  //           query: {
  //             addRow: () => { },
  //             deleteRow: () => { },
  //             createGroup: () => { },
  //             queryRows: [
  //               {
  //                 queryType: QueryType.Niche,
  //                 comparisonOperatorType: ComparisonOperatorType.Equal,
  //                 item: {
  //                   id: 2,
  //                   name: 'Recipes'
  //                 }
  //               },
  //               {
  //                 logicalOperatorType: LogicalOperatorType.And
  //               },
  //               {
  //                 queryType: QueryType.Rating,
  //                 comparisonOperatorType: ComparisonOperatorType.GreaterThanOrEqual,
  //                 integer: 3
  //               }
  //             ]
  //           }
  //         }
  //       }
  //     ]
  //   }
  // }





  // -------------------------------------------------------- On Row Selection Change -----------------------------------------------------------
  onRowSelectionChange(row: QueryRow) {
    if (row.selected) {
      this.selectedRows.push(row);
    } else {
      const index = this.selectedRows.findIndex(x => x == row);

      if (index != -1) this.selectedRows.splice(index, 1);
    }
  }



  // ------------------------------------------------------- On Group Selection Change ----------------------------------------------------------
  onGroupSelectionChange(group: QueryGroup) {
    if (group.selected) {
      this.selectedGroups.push(group);
      this.unselectRows(group);
    } else {
      const index = this.selectedGroups.findIndex(x => x == group);

      if (index != -1) this.selectedGroups.splice(index, 1);
    }
  }


  // -------------------------------------------------------- Is Group Icon Disabled ------------------------------------------------------------
  isGroupIconDisabled() {
    if (this.selectedRows.length + this.selectedGroups.length <= 1) return true;

    return !this.selectedRows.every(x => x.parentQuery == this.selectedRows[0].parentQuery);
  }




  // ------------------------------------------------------------- Unselect Rows ----------------------------------------------------------------
  unselectRows(group: QueryGroup) {
    group.query.queryRows.forEach((row: QueryRow) => {
      if (row.queryGroup) {
        this.unselectRows(row.queryGroup);
      } else {
        const index = this.selectedRows.findIndex(x => x == row);

        if (index != -1) {
          this.selectedRows[index].selected = false;
          this.selectedRows.splice(index, 1);
        }
      }
    });
  }





  // -------------------------------------------------------------- On Add Click ----------------------------------------------------------------
  onAddClick() {
    if (this.selectedRows.length > 0) {
      this.selectedRows[0].parentQuery?.addRow();
    } else {

    }
  }



  // ------------------------------------------------------------- On Delete Click --------------------------------------------------------------
  onDeleteClick() {
    for (let i = 0; i < this.selectedRows.length; i++) {
      const row = this.selectedRows[i];

      row.parentQuery?.deleteRow(row);
      this.selectedRows.splice(0, 1);
      i--;
    }

    if (this.query.queryRows.length == 0) {
      this.query = new Query();
    }
  }



  // -------------------------------------------------------------- On Group Click --------------------------------------------------------------
  onGroupClick() {
    const query = this.selectedRows[0].parentQuery!;

    query.createGroup(this.selectedRows.concat(this.selectedGroups));
    this.selectedRows = [];
    this.selectedGroups = [];
  }
}