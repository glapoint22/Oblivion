import { QueryGroup } from "./query-group";
import { QueryRow } from "./query-row";

export class Query {
    public queryRows!: Array<QueryRow>;
    public queryGroup?: QueryGroup;
}