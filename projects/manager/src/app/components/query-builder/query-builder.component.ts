import { Component } from '@angular/core';
import { ComparisonOperatorType, LogicalOperatorType, Query, QueryGroup, QueryRow, QueryType } from 'widgets';

@Component({
  selector: 'query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss']
})
export class QueryBuilderComponent {
  // public query: Query = {
  //   queryRows: [
  //     {
  //       queryType: QueryType.None
  //     }
  //   ]
  // }

  public selectedRows: Array<QueryRow> = [];
  public selectedGroups: Array<QueryGroup> = [];


  public query: Query = {
    queryRows: [
      {
        queryGroup: {
          query: {
            queryRows: [
              {
                queryType: QueryType.Price,
                comparisonOperatorType: ComparisonOperatorType.GreaterThanOrEqual,
                price: 5.99
              },
              {
                logicalOperatorType: LogicalOperatorType.And
              },
              {
                queryType: QueryType.Date,
                comparisonOperatorType: ComparisonOperatorType.GreaterThan,
                date: new Date('09/01/2022')
              }
            ]
          }
        }
      },
      {
        logicalOperatorType: LogicalOperatorType.Or
      },
      {
        queryGroup: {
          query: {
            queryRows: [
              {
                queryType: QueryType.Niche,
                comparisonOperatorType: ComparisonOperatorType.Equal,
                item: {
                  id: 2,
                  name: 'Recipes'
                }
              },
              {
                logicalOperatorType: LogicalOperatorType.And
              },
              {
                queryType: QueryType.Rating,
                comparisonOperatorType: ComparisonOperatorType.GreaterThanOrEqual,
                integer: 3
              }
            ]
          }
        }
      }
    ]
  }


  onRowSelectionChange(row: QueryRow) {
    if (row.selected) {
      this.selectedRows.push(row);
    } else {
      const index = this.selectedRows.findIndex(x => x == row);

      if (index != -1) this.selectedRows.splice(index, 1);
    }
  }



  onGroupSelectionChange(group: QueryGroup) {
    if (group.selected) {
      this.selectedGroups.push(group);
      this.unselectRows(group);
    } else {
      const index = this.selectedGroups.findIndex(x => x == group);

      if (index != -1) this.selectedGroups.splice(index, 1);
    }
  }



  isGroupIconDisabled() {
    if ((this.selectedRows.length <= 1 && this.selectedGroups.length <= 1) ||
      this.selectedRows.length >= 1 && this.selectedGroups.length >= 1) return true;

    return !this.selectedRows.every(x => x.query == this.selectedRows[0].query);
  }



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

}