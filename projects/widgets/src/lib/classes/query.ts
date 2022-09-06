import { QueryGroup } from "./query-group";
import { QueryRow } from "./query-row";
import { LogicalOperatorType, QueryType } from "./widget-enums";

export class Query {
    public queryRows!: Array<QueryRow>;
    public queryGroup?: QueryGroup;

    constructor(queryRows?: Array<QueryRow>) {
        if (queryRows) {
            this.queryRows = queryRows;
            this.queryRows.forEach((row: QueryRow) => row.queryGroup ? row.queryGroup.parentQuery = this : row.parentQuery = this);
        } else {
            this.queryRows = [
                {
                    queryType: QueryType.None,
                    parentQuery: this
                }
            ];
        }
    }


    // ---------------------------------------------------------------- Add Row ----------------------------------------------------------------
    public addRow(): void {
        // Add logicalOperator row
        this.queryRows.push({
            logicalOperatorType: LogicalOperatorType.And
        });

        // Add a blank row
        this.queryRows.push({
            queryType: QueryType.None,
            parentQuery: this
        });
    }




    // --------------------------------------------------------------- Delete Row --------------------------------------------------------------
    public deleteRow(row: QueryRow): void {
        const index = this.queryRows.findIndex(x => x == row);

        if (index != this.queryRows.length - 1) {
            this.queryRows.splice(index, 1);
            this.queryRows.splice(index, 1);
        } else {
            this.queryRows.splice(index - 1, 1);
            this.queryRows.splice(index - 1, 1);
        }
    }




    // -------------------------------------------------------------- Create Group -------------------------------------------------------------
    public createGroup(selectedRows: Array<QueryRow>) {
        let groupedRows: Array<QueryRow> = [];
        let counter: number = 0;
        let startIndex!: number;
        let logicalOperator: LogicalOperatorType = LogicalOperatorType.And;

        for (let i = 0; i < this.queryRows.length; i++) {
            const row = this.queryRows[i];

            if (selectedRows.some(x => x == row || x == row.queryGroup)) {
                row.selected = false;
                row.queryGroup ? row.queryGroup.selected = false : null;

                groupedRows.push(row);
                if (startIndex == undefined) startIndex = i;

                this.queryRows.splice(i, 1);
                i--;
                counter++;

                if (counter != selectedRows.length) {
                    groupedRows.push(this.queryRows[i + 1]);
                    this.queryRows.splice(i + 1, 1);
                } else {
                    if (i + 1 != this.queryRows.length) {
                        logicalOperator = this.queryRows[i + 1].logicalOperatorType!;
                        this.queryRows.splice(i + 1, 1);
                    }
                    break;
                }
            }
        }

        const query = new Query(groupedRows);
        const queryGroup = new QueryGroup(query, this);

        query.queryGroup = queryGroup;

        this.queryRows.splice(startIndex, 0, { queryGroup });

        if (startIndex != this.queryRows.length - 1) {
            this.queryRows.splice(startIndex + 1, 0, { logicalOperatorType: logicalOperator });
        }
    }
}