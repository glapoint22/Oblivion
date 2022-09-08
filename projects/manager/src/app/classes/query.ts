import { LogicalOperatorType, QueryType } from "./enums";
import { QueryElement } from "./query-element";
import { QueryGroup } from "./query-group";
import { QueryRow } from "./query-row";

export class Query {
    public elements!: Array<QueryElement>;
    public parent!: QueryGroup;

    constructor(queryElements?: Array<QueryElement>) {
        if (queryElements) {
            this.elements = queryElements;
        } else {
            this.elements = new Array<QueryElement>(new QueryRow(QueryType.None));
        }
    }


    // ---------------------------------------------------------------- Add Row ----------------------------------------------------------------
    public addRow(): void {
        const index = this.elements.findIndex(x => x.selected);

        // Unselect the selected element
        this.elements[index].selected = false;

        // Add logicalOperator row
        this.elements.splice(index + 1, 0, new QueryRow(undefined, LogicalOperatorType.And));

        // Add a blank row
        const row = new QueryRow(QueryType.None);
        this.elements.splice(index + 2, 0, row);
    }



    // --------------------------------------------------------------- Delete Elements --------------------------------------------------------------
    public deleteElements(): void {
        for (let i = 0; i < this.elements.length; i++) {
            const element = this.elements[i];

            if (element.selected) {
                this.deleteElement(element);
                i--;
            }
        }
    }



    // --------------------------------------------------------------- Delete Element --------------------------------------------------------------
    private deleteElement(element: QueryElement): void {
        const index = this.elements.findIndex(x => x == element);

        if (index != this.elements.length - 1) {
            this.elements.splice(index, 1);
            this.elements.splice(index, 1);
        } else {
            if (this.elements.length == 1) {
                this.elements.splice(index, 1);
            } else {
                this.elements.splice(index - 1, 1);
                this.elements.splice(index - 1, 1);
            }
        }

        if (this.elements.length == 0) {
            if (this.parent) {
                this.parent.parent.deleteElement(this.parent);
            }
        } else if (this.elements.length == 1 && !this.elements[0].selected) {
            if (this.parent) {
                const queryGroup = this.parent as QueryGroup;
                const index = queryGroup.parent.elements.findIndex(x => x == queryGroup);

                queryGroup.parent.ungroup(this.parent, index);
            }
        }
    }




    // -------------------------------------------------------------- Create Group -------------------------------------------------------------
    public createGroup(): void {
        const selectedCount = this.elements.filter(x => x.selected).length;
        let groupedElements: Array<QueryElement> = [];
        let counter: number = 0;
        let startIndex!: number;
        let logicalOperator: LogicalOperatorType = LogicalOperatorType.And;


        for (let i = 0; i < this.elements.length; i++) {
            const element = this.elements[i];

            // If element is selected
            if (element.selected) {
                element.selected = false;

                // Group the element
                groupedElements.push(element);

                // The start index is where the group will be placed
                if (startIndex == undefined) startIndex = i;

                // Remove the element from the query
                this.elements.splice(i, 1);
                i--;
                counter++;


                if (counter != selectedCount) {
                    groupedElements.push(this.elements[i + 1]);
                    this.elements.splice(i + 1, 1);
                } else {
                    // If we are not at the last element in the query, get the logical operator value
                    if (i + 1 != this.elements.length) {
                        logicalOperator = (this.elements[i + 1] as QueryRow).logicalOperatorType!;
                        this.elements.splice(i + 1, 1);
                    }
                    break;
                }
            }
        }

        const query = new Query(groupedElements);
        const queryGroup = new QueryGroup(query);

        // Place the group
        this.elements.splice(startIndex, 0, queryGroup);

        // If the group is not the last element, place a logical operator
        if (startIndex != this.elements.length - 1) {
            this.elements.splice(startIndex + 1, 0, new QueryRow(undefined, logicalOperator));
        }

        // If the last element in the query is a logical operator, remove it
        if (this.elements[this.elements.length - 1] instanceof QueryRow) {
            const queryRow = this.elements[this.elements.length - 1] as QueryRow;

            if (queryRow.logicalOperatorType != undefined) {
                this.elements.splice(this.elements.length - 1, 1);
            }
        }
    }





    // ----------------------------------------------------------------- Ungroup ---------------------------------------------------------------
    public ungroupElements(): void {
        for (let i = 0; i < this.elements.length; i++) {
            const element = this.elements[i];

            if (element.selected) {
                const queryGroup = element as QueryGroup;

                i = this.ungroup(queryGroup, i);
            }
        }
    }


    private ungroup(queryGroup: QueryGroup, startIndex: number): number {
        queryGroup.query.elements.forEach((queryElement: QueryElement, index: number) => {
            this.elements.splice(startIndex, index == 0 ? 1 : 0, queryElement);
            startIndex++;
        });

        return startIndex;
    }
}