import { QueryElementType } from "./enums";
import { Query } from "./query";
import { QueryGroup } from "./query-group";
import { QueryRow } from "./query-row";

export class QueryElement {
    public queryRow?: QueryRow;
    public queryGroup?: QueryGroup;
    public queryElementType!: QueryElementType;
    public selected!: boolean;
    public get element(): QueryRow | QueryGroup {
        return this.queryRow ? this.queryRow! : this.queryGroup!;
    }

    constructor(element: QueryRow | QueryGroup, public parent: Query) {
        const queryGroup = element as QueryGroup;

        if (queryGroup.query) {
            this.queryGroup = new QueryGroup(new Query(queryGroup.query.elements, this));
            this.queryElementType = QueryElementType.QueryGroup;
        } else {
            const queryRow = element as QueryRow;

            this.queryRow = new QueryRow({queryRow: queryRow});
            this.queryElementType = QueryElementType.QueryRow;
        }
    }
}