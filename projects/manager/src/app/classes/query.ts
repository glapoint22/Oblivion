import { LogicalOperatorType, QueryElementType } from "./enums";
import { QueryElement } from "./query-element";
import { QueryGroup } from "./query-group";
import { QueryRow } from "./query-row";

export class Query {
    public elements!: Array<QueryElement>;

    constructor(queryElements?: Array<QueryElement>, public parent?: QueryElement) {
        if (queryElements) {
            this.elements = [];
            queryElements.forEach((queryElement: QueryElement) => {
                this.elements.push(new QueryElement(queryElement.queryRow ? queryElement.queryRow! : queryElement.queryGroup!, this));
            });

        } else {
            const queryElement = new QueryElement(new QueryRow(), this);
            this.elements = new Array<QueryElement>(queryElement);
        }
    }


    // ---------------------------------------------------------------- Add Row ----------------------------------------------------------------
    public addRow(): void {
        const index = this.elements.findIndex(x => x.selected);

        // Unselect the selected element
        this.elements[index].selected = false;

        // Add logicalOperator row
        this.elements.splice(index + 1, 0, new QueryElement(new QueryRow({ logicalOperatorType: LogicalOperatorType.And }), this));

        // Add a query type row
        this.elements.splice(index + 2, 0, new QueryElement(new QueryRow(), this));
    }



    // --------------------------------------------------------------- Delete Elements --------------------------------------------------------------
    public deleteElements(): void {
        for (let i = 0; i < this.elements.length; i++) {
            const queryElement = this.elements[i];

            if (queryElement.selected) {
                this.deleteElement(queryElement);
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
                const index = this.parent.parent.elements.findIndex(x => x.element == this.parent!.element);

                this.parent.parent.ungroup(this.parent.element as QueryGroup, index);
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
            const queryElement = this.elements[i];

            // If element is selected
            if (queryElement.selected) {
                queryElement.selected = false;

                // Group the element
                groupedElements.push(queryElement);

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
                        logicalOperator = (this.elements[i + 1].element as QueryRow).logicalOperatorType!;
                        this.elements.splice(i + 1, 1);
                    }
                    break;
                }
            }
        }

        const query = new Query(groupedElements);

        // Place the group
        const queryElement = new QueryElement(new QueryGroup(query), this);
        query.parent = queryElement;

        this.elements.splice(startIndex, 0, queryElement);

        // If the group is not the last element, place a logical operator
        if (startIndex != this.elements.length - 1) {
            this.elements.splice(startIndex + 1, 0, new QueryElement(new QueryRow({ logicalOperatorType: logicalOperator }), this));
        }

        // If the last element in the query is a logical operator, remove it
        if (this.elements[this.elements.length - 1].queryElementType == QueryElementType.QueryRow) {
            const queryRow = this.elements[this.elements.length - 1].element as QueryRow;

            if (queryRow.logicalOperatorType != undefined) {
                this.elements.splice(this.elements.length - 1, 1);
            }
        }
    }





    // ------------------------------------------------------------- Ungroup Elements ----------------------------------------------------------
    public ungroupElements(): void {
        for (let i = 0; i < this.elements.length; i++) {
            const queryElement = this.elements[i];

            if (queryElement.selected) {
                const queryGroup = queryElement.element as QueryGroup;

                i = this.ungroup(queryGroup, i);
            }
        }
    }







    // ----------------------------------------------------------------- Ungroup ---------------------------------------------------------------
    private ungroup(queryGroup: QueryGroup, startIndex: number): number {
        queryGroup.query.elements.forEach((queryElement: QueryElement, index: number) => {
            queryElement.parent = this;
            this.elements.splice(startIndex, index == 0 ? 1 : 0, queryElement);
            startIndex++;
        });

        return startIndex;
    }
}