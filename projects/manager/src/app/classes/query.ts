import { LogicalOperatorType, QueryType } from "./enums";
import { QueryGroup } from "./query-group";
import { QueryRow } from "./query-row";

export class Query {
    public queryRows!: Array<QueryRow>;

    constructor(queryRows?: Array<QueryRow>) {
        if (queryRows) {
            this.queryRows = queryRows;
        } else {
            this.queryRows = [
                {
                    queryType: QueryType.None
                }
            ];
        }
    }


    // ---------------------------------------------------------------- Add Row ----------------------------------------------------------------
    public addRow(): void {
        const index = this.queryRows.findIndex(x => x.selected || x.queryGroup?.selected);

        if (this.queryRows[index].queryGroup && this.queryRows[index].queryGroup?.selected) {
            this.queryRows[index].queryGroup!.selected = false;
        } else {
            this.queryRows[index].selected = false;
        }


        // Add logicalOperator row
        this.queryRows.splice(index + 1, 0, {
            logicalOperatorType: LogicalOperatorType.And
        });

        // Add a blank row
        this.queryRows.splice(index + 2, 0, {
            queryType: QueryType.None,
            selected: true
        });
    }



    // --------------------------------------------------------------- Delete Rows --------------------------------------------------------------
    public deleteRows(): void {
        for (let i = 0; i < this.queryRows.length; i++) {
            const row = this.queryRows[i];

            if (row.selected || row.queryGroup?.selected) {
                this.deleteRow(row);
                i--;
            }
        }
    }



    // --------------------------------------------------------------- Delete Row --------------------------------------------------------------
    private deleteRow(row: QueryRow): void {
        const index = this.queryRows.findIndex(x => x == row);

        if (index != this.queryRows.length - 1) {
            this.queryRows.splice(index, 1);
            this.queryRows.splice(index, 1);
        } else {
            if (this.queryRows.length == 1) {
                this.queryRows.splice(index, 1);
            } else {
                this.queryRows.splice(index - 1, 1);
                this.queryRows.splice(index - 1, 1);
            }
        }
    }




    // -------------------------------------------------------------- Create Group -------------------------------------------------------------
    public createGroup(): void {
        const selectedCount = this.queryRows.filter(x => x.selected || x.queryGroup?.selected).length;
        let groupedRows: Array<QueryRow> = [];
        let counter: number = 0;
        let startIndex!: number;
        let logicalOperator: LogicalOperatorType = LogicalOperatorType.And;


        for (let i = 0; i < this.queryRows.length; i++) {
            const row = this.queryRows[i];

            if (row.selected || row.queryGroup?.selected) {
                row.selected = false;
                row.queryGroup ? row.queryGroup.selected = false : null;

                groupedRows.push(row);
                if (startIndex == undefined) startIndex = i;

                this.queryRows.splice(i, 1);
                i--;
                counter++;

                if (counter != selectedCount) {
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
        const queryGroup = new QueryGroup(query);

        queryGroup.selected = true;
        this.queryRows.splice(startIndex, 0, { queryGroup });

        if (startIndex != this.queryRows.length - 1) {
            this.queryRows.splice(startIndex + 1, 0, { logicalOperatorType: logicalOperator });
        }
    }





    // ----------------------------------------------------------------- Ungroup ---------------------------------------------------------------
    public ungroup(): void {
        for (let i = 0; i < this.queryRows.length; i++) {
            const row = this.queryRows[i];

            if (row.queryGroup?.selected) {
                row.queryGroup.query.queryRows.forEach((queryRow: QueryRow, index: number) => {
                    this.queryRows.splice(i, index == 0 ? 1 : 0, queryRow);
                    i++;
                });
            }
        }
    }

}