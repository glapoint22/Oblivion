import { Collaborator } from "./collaborator";
import { SummaryProduct } from "./summary-product";

export class ListProduct extends SummaryProduct {
    public dateAdded!: string;
    public collaborator!: Collaborator;
    public hoplink!: string;
}