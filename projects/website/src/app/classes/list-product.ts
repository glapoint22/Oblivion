import { SummaryProduct } from "common";
import { Collaborator } from "./collaborator";

export class ListProduct extends SummaryProduct {
    public dateAdded!: string;
    public collaborator!: Collaborator;
    public hoplink!: string;
}