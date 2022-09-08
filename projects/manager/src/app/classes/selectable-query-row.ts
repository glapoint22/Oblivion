import { QueryComponent } from "../components/query/query.component";

export interface SelectableQueryRow {
    selected: boolean;
    parentQuery: QueryComponent;
}